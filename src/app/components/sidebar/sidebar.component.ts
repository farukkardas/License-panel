import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SidenavToggle } from './Abstract/SidenavToggle';
import { navbarData } from './nav-data';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor(private authService: AuthService) { }
  navData = navbarData;
  collapsed: boolean = false;
  parentData?: string;
  screenWidth = 0;
  @Output() onToggleSidenav: EventEmitter<SidenavToggle> = new EventEmitter();
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSidenav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })

    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSidenav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSidenav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })
  }



  logout() {
    this.authService.logout()
  }


}
