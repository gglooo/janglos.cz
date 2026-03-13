export type WindowUiState = "normal" | "minimized" | "maximized";

export interface TaskbarWindow {
    id: number;
    title: string;
    state?: WindowUiState;
}
