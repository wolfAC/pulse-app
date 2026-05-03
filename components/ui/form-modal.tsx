"use client"

import { useState, useCallback, createContext, useContext, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel, FieldError, FieldDescription, FieldGroup } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

// Form Context for validation
interface FormContextValue {
  errors: Record<string, string>
  setError: (field: string, message: string) => void
  clearError: (field: string) => void
  clearAllErrors: () => void
}

const FormContext = createContext<FormContextValue | null>(null)

function useFormContext() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("Form components must be used within a FormModal")
  }
  return context
}

// Form Modal Props
interface FormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  onSubmit: () => void | Promise<void>
  submitLabel?: string
  cancelLabel?: string
  isSubmitting?: boolean
  size?: "sm" | "md" | "lg"
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  size = "md",
}: FormModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }, [])

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearAllErrors()
    await onSubmit()
  }

  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
  }

  return (
    <FormContext.Provider value={{ errors, setError, clearError, clearAllErrors }}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("max-h-[90vh] overflow-y-auto", sizeClasses[size])}>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            <FieldGroup className="gap-4 py-5">{children}</FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </FormContext.Provider>
  )
}

// Shared field props
interface BaseFieldProps {
  name: string
  label: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

// Text Input Field
interface TextFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: LucideIcon
  type?: "text" | "email" | "password" | "url"
}

export function TextField({
  name,
  label,
  description,
  required,
  disabled,
  className,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
}: TextFieldProps) {
  const { errors, clearError } = useFormContext()
  const error = errors[name]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    if (error) clearError(name)
  }

  return (
    <Field className={className} data-invalid={!!error}>
      <FieldLabel>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </FieldLabel>
      {Icon ? (
        <InputGroup data-invalid={!!error ? "true" : undefined}>
          <InputGroupAddon>
            <Icon className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            aria-invalid={!!error}
          />
        </InputGroup>
      ) : (
        <Input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
        />
      )}
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// Number Input Field
interface NumberFieldProps extends BaseFieldProps {
  value: number | string
  onChange: (value: number | string) => void
  placeholder?: string
  icon?: LucideIcon
  min?: number
  max?: number
  step?: number
  unit?: string
}

export function NumberField({
  name,
  label,
  description,
  required,
  disabled,
  className,
  value,
  onChange,
  placeholder,
  icon: Icon,
  min,
  max,
  step,
  unit,
}: NumberFieldProps) {
  const { errors, clearError } = useFormContext()
  const error = errors[name]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? "" : Number(e.target.value)
    onChange(val)
    if (error) clearError(name)
  }

  return (
    <Field className={className} data-invalid={!!error}>
      <FieldLabel>
        {label}
        {unit && <span className="text-muted-foreground font-normal">({unit})</span>}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </FieldLabel>
      {Icon || unit ? (
        <InputGroup data-invalid={!!error ? "true" : undefined}>
          {Icon && (
            <InputGroupAddon>
              <Icon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
          )}
          <InputGroupInput
            type="number"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            aria-invalid={!!error}
          />
          {unit && !Icon && (
            <InputGroupAddon align="inline-end">
              <span className="text-muted-foreground text-sm">{unit}</span>
            </InputGroupAddon>
          )}
        </InputGroup>
      ) : (
        <Input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          aria-invalid={!!error}
        />
      )}
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// Date Input Field
interface DateFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  icon?: LucideIcon
  min?: string
  max?: string
}

export function DateField({
  name,
  label,
  description,
  required,
  disabled,
  className,
  value,
  onChange,
  icon: Icon,
  min,
  max,
}: DateFieldProps) {
  const { errors, clearError } = useFormContext()
  const error = errors[name]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    if (error) clearError(name)
  }

  return (
    <Field className={className} data-invalid={!!error}>
      <FieldLabel>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </FieldLabel>
      {Icon ? (
        <InputGroup data-invalid={!!error ? "true" : undefined}>
          <InputGroupAddon>
            <Icon className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            type="date"
            value={value}
            onChange={handleChange}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            aria-invalid={!!error}
          />
        </InputGroup>
      ) : (
        <Input
          type="date"
          value={value}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          aria-invalid={!!error}
        />
      )}
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// Select Field
interface SelectOption {
  value: string
  label: string
  icon?: LucideIcon
}

interface SelectFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
}

export function SelectField({
  name,
  label,
  description,
  required,
  disabled,
  className,
  value,
  onChange,
  options,
  placeholder = "Select an option",
}: SelectFieldProps) {
  const { errors, clearError } = useFormContext()
  const error = errors[name]

  const handleChange = (val: string) => {
    onChange(val)
    if (error) clearError(name)
  }

  return (
    <Field className={className} data-invalid={!!error}>
      <FieldLabel>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </FieldLabel>
      <Select value={value} onValueChange={handleChange} disabled={disabled} required={required}>
        <SelectTrigger aria-invalid={!!error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {option.icon && <option.icon className="size-4" />}
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// Textarea Field
interface TextareaFieldProps extends BaseFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function TextareaField({
  name,
  label,
  description,
  required,
  disabled,
  className,
  value,
  onChange,
  placeholder,
  rows = 3,
}: TextareaFieldProps) {
  const { errors, clearError } = useFormContext()
  const error = errors[name]

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    if (error) clearError(name)
  }

  return (
    <Field className={className} data-invalid={!!error}>
      <FieldLabel>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </FieldLabel>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        aria-invalid={!!error}
      />
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// Form Row for horizontal layouts
interface FormRowProps {
  children: ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function FormRow({ children, columns = 2, className }: FormRowProps) {
  const colsClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }

  return <div className={cn("grid gap-4", colsClass[columns], className)}>{children}</div>
}

// Form Section for grouping fields
interface FormSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h4 className="text-sm font-medium">{title}</h4>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

// Export form context hook for custom validation
export { useFormContext }
