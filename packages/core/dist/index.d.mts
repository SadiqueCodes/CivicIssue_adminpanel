import { ClassValue } from 'clsx';
import { z } from 'zod';
import { ReactNode } from 'react';

/**
 * Utility function to merge class names
 * Combines clsx functionality for conditional classes
 */
declare function cn(...inputs: ClassValue[]): string;

/**
 * Application-wide constants
 */
declare const APP_NAME = "Digital Employee Platform";
declare const APP_VERSION = "0.1.0";
declare const API_ENDPOINTS: {
    readonly AUTH: "/api/auth";
    readonly CHAT: "/api/chat";
    readonly FILES: "/api/files";
    readonly TASKS: "/api/tasks";
};
declare const DE_TYPES: {
    readonly DA: "data-analyst";
    readonly CSR: "customer-service";
    readonly SA: "sales-agent";
    readonly HR: "hr-assistant";
};
declare const TASK_STATUS: {
    readonly RUNNING: "running";
    readonly COMPLETED: "completed";
    readonly ERROR: "error";
    readonly IDLE: "idle";
};
declare const MESSAGE_TYPES: {
    readonly USER: "user";
    readonly ASSISTANT: "assistant";
    readonly SYSTEM: "system";
    readonly ERROR: "error";
};
declare const FILE_SIZE_LIMITS: {
    readonly IMAGE: number;
    readonly DOCUMENT: number;
    readonly MAX_FILES_PER_MESSAGE: 5;
};
declare const SUPPORTED_FILE_TYPES: {
    readonly IMAGES: readonly ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    readonly DOCUMENTS: readonly ["application/pdf", "text/csv", "application/vnd.ms-excel"];
};

type TDEType = (typeof DE_TYPES)[keyof typeof DE_TYPES];
type TTaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
interface ITask {
    id: string;
    title: string;
    deType: TDEType;
    status: TTaskStatus;
    createdAt: Date;
    updatedAt: Date;
    lastMessage?: string;
}
type TMessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];
interface IMessage {
    id: string;
    taskId: string;
    type: TMessageType;
    content: string;
    timestamp: Date;
    attachments?: IAttachment[];
    metadata?: Record<string, unknown>;
}
interface IAttachment {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    thumbnailUrl?: string;
}
interface IUser {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    preferences?: IUserPreferences;
}
interface IUserPreferences {
    theme: 'light' | 'dark' | 'system';
    defaultDE?: TDEType;
    notifications: boolean;
}
interface IApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    metadata?: {
        timestamp: string;
        requestId: string;
    };
}
declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    name?: string | undefined;
    avatar?: string | undefined;
}, {
    id: string;
    email: string;
    name?: string | undefined;
    avatar?: string | undefined;
}>;
declare const MessageSchema: z.ZodObject<{
    id: z.ZodString;
    taskId: z.ZodString;
    type: z.ZodEnum<["user", "assistant", "system", "error"]>;
    content: z.ZodString;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "error" | "user" | "assistant" | "system";
    taskId: string;
    content: string;
    timestamp: Date;
}, {
    id: string;
    type: "error" | "user" | "assistant" | "system";
    taskId: string;
    content: string;
    timestamp: Date;
}>;

interface QueryProviderProps {
    children: ReactNode;
    options?: {
        staleTime?: number;
        gcTime?: number;
        retry?: number;
        refetchOnWindowFocus?: boolean;
    };
}
declare function QueryProvider({ children, options }: QueryProviderProps): JSX.Element;

export { API_ENDPOINTS, APP_NAME, APP_VERSION, DE_TYPES, FILE_SIZE_LIMITS, type IApiResponse, type IAttachment, type IMessage, type ITask, type IUser, type IUserPreferences, MESSAGE_TYPES, MessageSchema, QueryProvider, type QueryProviderProps, SUPPORTED_FILE_TYPES, TASK_STATUS, type TDEType, type TMessageType, type TTaskStatus, UserSchema, cn };
