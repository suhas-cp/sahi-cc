// Register only the ECharts pieces Kumo's TimeseriesChart needs, so the bundle stays small.
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  AriaComponent,
  BrushComponent,
  GridComponent,
  MarkLineComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  BrushComponent,
  ToolboxComponent,
  AriaComponent,
  CanvasRenderer,
]);

export { echarts };
