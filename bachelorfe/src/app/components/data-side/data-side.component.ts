import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-side',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-side.component.html',
  styleUrl: './data-side.component.scss'
})
export class DataSideComponent {

  @Input() shouldRender: boolean = true;

}
