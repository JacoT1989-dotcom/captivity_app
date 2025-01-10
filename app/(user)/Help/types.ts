export type ValidationError = {
  path: string;
  message: string;
};

export type HelpFormResponse =
  | {
      success: true;
      remainingSubmissions: number;
      message: string;
    }
  | {
      error: string;
      validationErrors?: ValidationError[];
      remainingSubmissions?: number;
      limitReached?: boolean;
    };
