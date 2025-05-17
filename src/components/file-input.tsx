"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string
  label?: string
  helperText?: string
  buttonText?: string
  icon?: React.ReactNode
  onFileSelect?: (file: File | null) => void
}

export function FileInput({
  className,
  placeholder = "No file selected",
  label,
  helperText,
  buttonText = "Select file",
  icon = <Upload className="mr-2 h-4 w-4" />,
  onFileSelect,
  ...props
}: FileInputProps) {
  const [fileName, setFileName] = React.useState<string>(placeholder)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFileName(file ? file.name : placeholder)
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  return (
    <div className={cn("grid w-full gap-1.5", className)}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <div className="flex items-center gap-2">
        <Input ref={inputRef} type="file" className="hidden" onChange={handleChange} {...props} />
        <Button type="button" variant="outline" onClick={handleClick} className="shrink-0">
          {icon}
          {buttonText}
        </Button>
        <div className="w-full overflow-hidden">
          <p className="truncate text-sm text-muted-foreground">{fileName}</p>
        </div>
      </div>
      {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
    </div>
  )
}
