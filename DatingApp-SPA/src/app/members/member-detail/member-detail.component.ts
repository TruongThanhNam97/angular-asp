import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  destroySubscription$: Subject<boolean> = new Subject();

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.pipe(
      takeUntil(this.destroySubscription$)
    ).subscribe(data => {
      this.user = data.user;
    });
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true,
        previewFullscreen: true,
        previewSwipe: true,
        previewCloseOnClick: true,
        previewCloseOnEsc: true,
        previewAnimation: true,
        previewZoom: true
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

}
