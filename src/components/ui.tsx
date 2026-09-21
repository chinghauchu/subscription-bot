import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatNtd } from '@/store/dates';
import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type TextInputProps,
  type TextProps,
  type ViewProps,
} from 'react-native';

export function Screen({ children, style }: ViewProps) {
  const theme = useTheme();
  return (
    <View style={[{ flex: 1, backgroundColor: theme.background }, style]}>{children}</View>
  );
}

export function Card({ children, style, accent }: ViewProps & { accent?: string }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
        accent ? { borderLeftWidth: 4, borderLeftColor: accent } : null,
        style,
      ]}>
      {children}
    </View>
  );
}

export function AppText({
  type = 'body',
  color,
  style,
  ...rest
}: TextProps & { type?: 'hero' | 'title' | 'subtitle' | 'body' | 'caption' | 'label' | 'money'; color?: string }) {
  const theme = useTheme();
  return (
    <Text
      style={[
        { color: color ?? theme.text },
        type === 'hero' && styles.hero,
        type === 'title' && styles.title,
        type === 'subtitle' && styles.subtitle,
        type === 'body' && styles.body,
        type === 'caption' && styles.caption,
        type === 'label' && styles.label,
        type === 'money' && styles.money,
        style,
      ]}
      {...rest}
    />
  );
}

export function Money({ amount, size = 'lg' }: { amount: number; size?: 'sm' | 'lg' | 'xl' }) {
  const theme = useTheme();
  return (
    <AppText
      type="money"
      color={theme.gold}
      style={size === 'xl' ? styles.moneyXl : size === 'sm' ? styles.moneySm : undefined}>
      {formatNtd(amount)}
    </AppText>
  );
}

export function PrimaryButton({
  title,
  loading,
  disabled,
  ...props
}: PressableProps & { title: string; loading?: boolean }) {
  const theme = useTheme();
  const isDisabled = Boolean(disabled || loading);
  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.accent, opacity: isDisabled ? 0.55 : pressed ? 0.85 : 1 },
      ]}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonLabel}>{title}</Text>
      )}
    </Pressable>
  );
}

export function GhostButton({ title, ...props }: PressableProps & { title: string }) {
  const theme = useTheme();
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.ghost,
        { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
      ]}>
      <AppText type="label" color={theme.accent}>
        {title}
      </AppText>
    </Pressable>
  );
}

export function Field({
  label,
  ...props
}: TextInputProps & { label: string }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <AppText type="label" color={theme.textSecondary}>
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        {...props}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.surfaceAlt, borderColor: theme.border },
          props.style,
        ]}
      />
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.accent : theme.surfaceAlt,
          borderColor: selected ? theme.accent : theme.border,
        },
      ]}>
      <AppText type="caption" color={selected ? '#fff' : theme.text}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  const theme = useTheme();
  return (
    <View style={[styles.progressTrack, { backgroundColor: theme.surfaceAlt }]}>
      <View
        style={[
          styles.progressFill,
          { width: `${Math.max(0, Math.min(100, percent))}%`, backgroundColor: theme.accent },
        ]}
      />
    </View>
  );
}

export function Row({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewProps['style'];
}) {
  const theme = useTheme();
  const content = (
    <View style={[styles.row, { borderColor: theme.border }, style]}>{children}</View>
  );
  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.72 }}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  hero: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  money: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.6,
  },
  moneyXl: {
    fontSize: 40,
    lineHeight: 46,
  },
  moneySm: {
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    minHeight: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  ghost: {
    minHeight: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  input: {
    minHeight: 48,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  progressTrack: {
    height: 8,
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 99,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
