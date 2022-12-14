import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElementTimelineComponent } from './components/timeline/element-timeline/element-timeline.component';
import { PropertyTimelineComponent } from './components/timeline/property-timeline/property-timeline.component';
import { StageComponent } from './components/stage/stage.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { AnimatableElementComponent } from './components/animatables/animatable-element/animatable-element.component';
import { PropertyInspectorComponent } from './components/property-inspector/property-inspector.component';
import { TimelineService } from './services/timeline.service';
import { AllDragComponent } from './components/timeline/element-timeline/all-drag/all-drag.component';
import { ScrubBarComponent } from './components/timeline/scrub-bar/scrub-bar.component';
import { ControlComponent } from './components/property-inspector/control/control.component';
import { DummyComponentComponent } from './components/animatables/dummy-component/dummy-component.component';
import { ComponentHostDirective } from './components/helper/component-host.directive';
import { ComponentsModule } from '@richapps/components';

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
    DummyComponentComponent,
    ComponentHostDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule
  ],
  providers: [TimelineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
