"use client";

import { useCallback, useMemo, useState, type ChangeEvent, type DragEvent, type HTMLAttributes, type InputHTMLAttributes } from "react";

type DropzoneOptions = {
  onDrop?: (acceptedFiles: File[]) => void;
  multiple?: boolean;
  accept?: Record<string, string[]>;
};

export function useDropzone(options: DropzoneOptions) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onFiles = useCallback(
    (files: FileList | null) => {
      if (!files) {
        return;
      }
      const asArray = Array.from(files);
      const accepted = options.multiple === false ? asArray.slice(0, 1) : asArray;
      options.onDrop?.(accepted);
    },
    [options]
  );

  const getRootProps = useCallback(
    (props: HTMLAttributes<HTMLDivElement> = {}) => ({
      ...props,
      onDragOver: (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragActive(true);
        props.onDragOver?.(event);
      },
      onDragLeave: (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragActive(false);
        props.onDragLeave?.(event);
      },
      onDrop: (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragActive(false);
        onFiles(event.dataTransfer.files);
        props.onDrop?.(event);
      },
    }),
    [onFiles]
  );

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
      ...props,
      type: "file" as const,
      multiple: options.multiple !== false,
      accept: options.accept ? Object.keys(options.accept).join(",") : undefined,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        onFiles(event.target.files);
        props.onChange?.(event);
      },
    }),
    [onFiles, options.accept, options.multiple]
  );

  return useMemo(
    () => ({
      getRootProps,
      getInputProps,
      isDragActive,
    }),
    [getInputProps, getRootProps, isDragActive]
  );
}
