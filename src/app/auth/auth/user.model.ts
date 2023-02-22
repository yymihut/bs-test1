export class User {
  constructor(
    public email: string,
    public id: string,
    private _accessToken: string,
    private _expirationTime: Date,
    public displayName: string
  ) {}

  get token() {
    if (!this._expirationTime || new Date() > this._expirationTime) {
      return null;
    }
    return this._accessToken;
  }
}
