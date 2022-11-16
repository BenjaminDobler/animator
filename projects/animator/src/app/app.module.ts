import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElementTimelineComponent } from './components/timeline/element-timeline/element-timeline.component';
import { PropertyTimelineComponent } from './components/timeline/property-timeline/property-timeline.component';
import { StageComponent } from './components/stage/stage.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { AnimatableElementComponent } from './components/animatable-element/animatable-element.component';
import { PropertyInspectorComponent } from './components/property-inspector/property-inspector.component';
import { TimelineService } from './services/timeline.service';
import { AllDragComponent } from './components/timeline/element-timeline/all-drag/all-drag.component';
import { ScrubBarComponent } from './components/timeline/scrub-bar/scrub-bar.component';
import { ControlComponent } from './components/property-inspector/control/control.component';

@NgModule({
  declarations: [
    AppComponent,
    ElementTimelineComponent,
    PropertyTimelineComponent,
    StageComponent,
    TimelineComponent,
    AnimatableElementComponent,
    PropertyInspectorComponent,
    AllDragComponent,
    ScrubBarComponent,
    ControlComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [TimelineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
