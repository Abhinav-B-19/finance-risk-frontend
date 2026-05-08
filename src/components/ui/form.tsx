"use client";

import * as React from "react";

import * as LabelPrimitive from "@radix-ui/react-label";

import {
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import {
  Label,
} from "@/components/ui/label";

export const Form =
  FormProvider;

export const FormField =
  Controller;

const FormItemContext =
  React.createContext<any>(
    {}
  );

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={className}
      {...props}
    />
  );
});

FormItem.displayName =
  "FormItem";

const FormLabel =
  React.forwardRef<
    React.ElementRef<
      typeof LabelPrimitive.Root
    >,
    React.ComponentPropsWithoutRef<
      typeof LabelPrimitive.Root
    >
  >(({ className, ...props }, ref) => {
    return (
      <Label
        ref={ref}
        className={className}
        {...props}
      />
    );
  });

FormLabel.displayName =
  "FormLabel";

const FormControl =
  React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(
    (
      { className, ...props },
      ref
    ) => {
      return (
        <div
          ref={ref}
          className={className}
          {...props}
        />
      );
    }
  );

FormControl.displayName =
  "FormControl";

const FormMessage = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  if (!children) {
    return null;
  }

  return (
    <p className="text-sm font-medium text-red-500">
      {children}
    </p>
  );
};

export {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
};