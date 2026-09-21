import ExpoModulesCore
import Foundation

private let containerId = "iCloud.app.clearbill.tw"
private let documentFileName = "clearbill-snapshot.json"
private let kvSnapshotKey = "clearbill.snapshot.v1"
private let kvUpdatedAtKey = "clearbill.updatedAt.v1"

internal final class ICloudUnavailableException: Exception {
  override var reason: String {
    "iCloud Documents container is unavailable. Sign in to iCloud in Settings."
  }
}

internal final class ICloudWriteException: GenericException<String> {
  override var reason: String {
    "Failed to write iCloud snapshot: \(param)"
  }
}

public class ClearbillIcloudModule: Module {
  private var identityObserver: NSObjectProtocol?
  private var kvObserver: NSObjectProtocol?

  public func definition() -> ModuleDefinition {
    Name("ClearbillIcloud")

    Events("onAccountChanged", "onStoreChanged")

    OnCreate {
      NSUbiquitousKeyValueStore.default.synchronize()

      identityObserver = NotificationCenter.default.addObserver(
        forName: NSNotification.Name.NSUbiquityIdentityDidChange,
        object: nil,
        queue: .main
      ) { [weak self] _ in
        self?.sendEvent("onAccountChanged", self?.statusDict() ?? [:])
      }

      kvObserver = NotificationCenter.default.addObserver(
        forName: NSUbiquitousKeyValueStore.didChangeExternallyNotification,
        object: NSUbiquitousKeyValueStore.default,
        queue: .main
      ) { [weak self] _ in
        self?.sendEvent("onStoreChanged", ["source": "kv"])
      }
    }

    OnDestroy {
      if let identityObserver {
        NotificationCenter.default.removeObserver(identityObserver)
      }
      if let kvObserver {
        NotificationCenter.default.removeObserver(kvObserver)
      }
    }

    Function("getStatus") { () -> [String: Any] in
      self.statusDict()
    }

    AsyncFunction("synchronize") { () -> Bool in
      NSUbiquitousKeyValueStore.default.synchronize()
    }

    AsyncFunction("readSnapshot") { () -> String? in
      if let document = self.readDocument() {
        return document
      }
      return NSUbiquitousKeyValueStore.default.string(forKey: kvSnapshotKey)
    }

    AsyncFunction("writeSnapshot") { (json: String) in
      let now = ISO8601DateFormatter().string(from: Date())
      let store = NSUbiquitousKeyValueStore.default
      store.set(json, forKey: kvSnapshotKey)
      store.set(now, forKey: kvUpdatedAtKey)
      store.synchronize()
      try self.writeDocument(json: json)
    }

    AsyncFunction("kvGet") { (key: String) -> String? in
      NSUbiquitousKeyValueStore.default.string(forKey: key)
    }

    AsyncFunction("kvSet") { (key: String, value: String) in
      let store = NSUbiquitousKeyValueStore.default
      store.set(value, forKey: key)
      store.synchronize()
    }
  }

  private func statusDict() -> [String: Any] {
    let signedIn = FileManager.default.ubiquityIdentityToken != nil
    let container = FileManager.default.url(forUbiquityContainerIdentifier: containerId)
    let reason: String
    if !signedIn {
      reason = "signed-out"
    } else if container == nil {
      reason = "container-unavailable"
    } else {
      reason = "ok"
    }

    return [
      "available": signedIn && container != nil,
      "signedIn": signedIn,
      "reason": reason,
      "containerId": containerId,
      "containerPath": container?.path ?? "",
      "kvUpdatedAt": NSUbiquitousKeyValueStore.default.string(forKey: kvUpdatedAtKey) ?? "",
    ]
  }

  private func documentsDirectory() -> URL? {
    FileManager.default
      .url(forUbiquityContainerIdentifier: containerId)?
      .appendingPathComponent("Documents", isDirectory: true)
  }

  private func documentURL() -> URL? {
    documentsDirectory()?.appendingPathComponent(documentFileName, isDirectory: false)
  }

  private func readDocument() -> String? {
    guard let url = documentURL() else { return nil }
    var coordinatorError: NSError?
    var result: String?
    let coordinator = NSFileCoordinator()
    coordinator.coordinate(readingItemAt: url, options: [], error: &coordinatorError) { readURL in
      result = try? String(contentsOf: readURL, encoding: .utf8)
    }
    return result
  }

  private func writeDocument(json: String) throws {
    guard let directory = documentsDirectory(), let url = documentURL() else {
      throw ICloudUnavailableException()
    }

    try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)

    var coordinatorError: NSError?
    var writeError: Error?
    let coordinator = NSFileCoordinator()
    coordinator.coordinate(writingItemAt: url, options: .forReplacing, error: &coordinatorError) { writeURL in
      do {
        try json.write(to: writeURL, atomically: true, encoding: .utf8)
      } catch {
        writeError = error
      }
    }

    if let coordinatorError {
      throw ICloudWriteException(coordinatorError.localizedDescription)
    }
    if let writeError {
      throw ICloudWriteException(writeError.localizedDescription)
    }
  }
}
