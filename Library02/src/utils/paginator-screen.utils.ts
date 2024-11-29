export class ScreenSize {
  static isScreenSizeMobile(): boolean {
    if (screen.width <= 877) {
      return true;
    } else {
      return false;
    }
  }
}