export type DesktopIconContextAction = "open" | "delete";

export type DesktopIconContextTarget =
    | {
          kind: "item";
          itemId: string;
      }
    | {
          kind: "trash";
      };
