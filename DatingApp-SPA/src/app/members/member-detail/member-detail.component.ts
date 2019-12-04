import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  destroySubscription$: Subject<boolean> = new Subject();

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.route.data.pipe(
      takeUntil(this.destroySubscription$)
    ).subscribe(data => {
      this.user = data.user;
    });
    this.route.queryParams.subscribe(params => {
      const selectedTab = params.tab;
      this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    });
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 5,
        imageAnimation: NgxGalleryAnimation.Fade,
        preview: true,
        previewFullscreen: true,
        previewSwipe: true,
        previewCloseOnEsc: true,
        previewAnimation: false,
        previewZoom: true,
        imageSize: NgxGalleryImageSize.Cover,
        previewKeyboardNavigation: true,
        previewRotate: true,
        previewDownload: true
      }
    ];
    this.galleryImages = this.getImages();
  }

  ngOnDestroy() {
    this.destroySubscription$.next(true);
  }

  getImages() {
    const imageUrls = [];
    this.user.photos.forEach(photo => {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    });

    return imageUrls;
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  sendLike(id: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, id).pipe(
      takeUntil(this.destroySubscription$)
    ).subscribe(data => {
      this.alertify.success('You have liked: ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    });
  }

}
