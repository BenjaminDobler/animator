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

@NgModule({
  declarations: [
    AppComponent,
    ElementTimelineComponent,
    PropertyTimelineComponent,
    StageComponent,
    TimelineComponent,
    AnimatableElementComponent,
    PropertyInspectorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
