import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SnackbarService} from './snackbar.service';
import {Subscription} from 'rxjs';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-snackbar',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
  animations: [
    trigger('state', [
      transition(':enter', [
        style({bottom: '-100px', transform: 'translate(-50%, 0%) scale(0.3)'}),
        animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({
          transform: 'translate(-50%, 0%) scale(1)',
          opacity: 1,
          bottom: '20px'
        })),
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0.0, 1, 1)', style({
          transform: 'translate(-50%, 0%) scale(0.3)',
          opacity: 0,
          bottom: '-100px'
        }))
      ])
    ])
  ]
})
export class SnackbarComponent implements OnInit, OnDestroy {

  show = false;

  message = 'This is snackbar.';

  private type = 'success';

  private snackbarSubscription: Subscription;

  constructor(private snackbarService: SnackbarService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.snackbarSubscription = this.snackbarService.snackbarState
    .subscribe(
      (state) => {
        if (state.type) {
          this.type = state.type;
        } else {
          this.type = 'success';
        }
        this.message = state.message;
        this.show = state.show;
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
          this.show = false;
          this.changeDetectorRef.detectChanges();
        }, 5000);
      });
  }

  ngOnDestroy() {
    this.snackbarSubscription.unsubscribe();
  }

  classes(): Array<string> {
    const classes = new Array<string>();
    classes.push('snackbar-wrap');
    classes.push('alert');
    if (this.type === 'success') {
      classes.push('alert-success');
    } else {
      classes.push('alert-danger');
    }
    classes.push('alert-dismissible');
    return classes;
  }

  hideMessage(): void {
    this.show = false;
  }

}
