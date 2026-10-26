import { AuthToken, User } from "tweeter-shared";
import { RegisterService } from "../model.service/RegisterService";
import { Buffer } from "buffer";
import type { ChangeEvent, KeyboardEvent } from "react";
import { View, Presenter } from "./Presenter";

export interface RegisterView extends View {
  displayErrorMessage(message: string): void;
  setImageUrl(url: string): void;
  setImageBytes(bytes: Uint8Array): void;
  setImageFileExtension(extension: string): void;
}

export class RegisterPresenter extends Presenter<RegisterView> {
  private registerService: RegisterService;

  public constructor(view: RegisterView) {
    super(view);
    this.registerService = new RegisterService();
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ) {
    this.doFailureReportingOperation(async () => {
      await this.registerService.register(
        firstName,
        lastName,
        alias,
        password,
        userImageBytes,
        imageFileExtension,
      );
    }, "register user");
  }

  public getFileExtension(file: File): string | undefined {
    const parts = file.name.split(".");
    const extension = parts.length > 1 ? parts.pop() : undefined;

    return extension || undefined;
  }

  public registerOnEnter = (
    event: KeyboardEvent<HTMLElement>,
    submitDisabled: boolean,
    submit: () => void | Promise<void>,
  ): void => {
    if (event.key === "Enter" && !submitDisabled) {
      event.preventDefault();
      void submit();
    }
  };

  public handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (!file) {
      this.clearImage();
      return;
    }

    const fileExtension = this.getFileExtension(file);

    if (!fileExtension) {
      this.clearImage();
      this.view.displayErrorMessage(
        "Please select an image file with a valid extension.",
      );
      return;
    }

    this.view.setImageUrl(URL.createObjectURL(file));
    this.view.setImageFileExtension(fileExtension);

    const reader = new FileReader();

    reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
      const result = loadEvent.target?.result;

      if (typeof result !== "string") {
        this.clearImage();
        this.view.displayErrorMessage("Unable to read the selected image.");
        return;
      }

      const base64Contents = result.split("base64,")[1];

      if (!base64Contents) {
        this.clearImage();
        this.view.displayErrorMessage("Unable to process the selected image.");
        return;
      }

      const bytes = Buffer.from(base64Contents, "base64");
      this.view.setImageBytes(new Uint8Array(bytes));
    };

    reader.onerror = () => {
      this.clearImage();
      this.view.displayErrorMessage("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  private clearImage(): void {
    this.view.setImageUrl("");
    this.view.setImageBytes(new Uint8Array());
    this.view.setImageFileExtension("");
  }
}
