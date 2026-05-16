import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  sidebarActive = signal(false);

  toggleSidebar() {
    this.sidebarActive.update(v => !v);
  }

  closeSidebar() {
    this.sidebarActive.set(false);
  }
}
