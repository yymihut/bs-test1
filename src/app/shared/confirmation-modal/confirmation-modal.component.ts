import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  NgbModal,
  NgbModalConfig,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
@Injectable()
export class ConfirmationModalComponent implements OnInit {
  @ViewChild('confirmationModal')
  private modalContent!: TemplateRef<ConfirmationModalComponent>;
  @Output() newConfirmationEvent = new EventEmitter<string>();
  @Output('resetare') resetare:EventEmitter<any> = new EventEmitter();

  @Input() modalStyle: any;
  @Input() modalTitle: any;
  @Input() modalBody: any;
  @Input() modalButtonColor: any;
  @Input() text: any;

  private modalRef!: NgbModalRef;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = true;
    config.centered = true;
    config.scrollable = true;
    config.animation = true;
  }

  ngOnInit(): void {}

  resetareForm() {
    this.resetare.emit();
  }

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent, { size: 'xl' });
      this.modalRef.result.then(
        (result) => {
          console.log(result);
          this.resetare.emit();
          this.newConfirmationEvent.emit(result);
        },
        (reason) => {
          console.log(reason);
        }
      );
    });
  }
}
