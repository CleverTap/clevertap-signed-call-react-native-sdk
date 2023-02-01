class SignedCallResponse {
  isSuccessful: boolean;
  error: SignedCallError | null;

  private constructor(isSuccessful: boolean, error: SignedCallError | null) {
    this.isSuccessful = isSuccessful;
    this.error = error;
  }

  static fromDict(dict: any): SignedCallResponse {
    const isSuccessful = dict.isSuccessful;
    const error = dict.error ? SignedCallError.fromDict(dict.error) : null;
    return new SignedCallResponse(isSuccessful, error);
  }
}

class SignedCallError {
  errorCode: number;
  errorMessage: string;
  errorDescription: string;

  private constructor(
    errorCode: number,
    errorMessage: string,
    errorDescription: string
  ) {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.errorDescription = errorDescription;
  }

  static fromDict(dict: any): SignedCallError {
    return new SignedCallError(
      dict.errorCode,
      dict.errorMessage,
      dict.errorDescription
    );
  }
}

export { SignedCallResponse };
