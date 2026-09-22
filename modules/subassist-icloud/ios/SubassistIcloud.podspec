Pod::Spec.new do |s|
  s.name           = 'SubassistIcloud'
  s.version        = '1.0.0'
  s.summary        = 'iCloud Key-Value Store and Documents for sub-assist'
  s.description    = 'NSUbiquitousKeyValueStore + iCloud Documents snapshot sync'
  s.author         = 'chinghauchu'
  s.homepage       = 'https://github.com/chinghauchu/subscription-bot'
  s.license        = 'MIT'
  s.platforms      = { :ios => '15.1', :tvos => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
  s.frameworks = 'Foundation'
end
