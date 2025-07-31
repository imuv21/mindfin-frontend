// src/components/auth/PasswordInput.jsx
import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const PasswordInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = "Enter Password",
  showConfirmation = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1 block">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default PasswordInput;