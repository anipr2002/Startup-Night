type OptionValue = string | number

export interface OptionObject {
  [key: string]: OptionValue
}

export type OptionType = OptionValue | OptionObject

export interface FancySwitchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: OptionValue
  onChange?: (value: OptionValue) => void

  options: OptionType[]
  valueKey?: string
  labelKey?: string
  defaultValue?: OptionValue
  radioClassName?: string
  highlighterClassName?: string
  highlighterIncludeMargin?: boolean
}