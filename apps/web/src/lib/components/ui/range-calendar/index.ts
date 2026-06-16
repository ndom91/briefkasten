import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui"
import Root from "./range-calendar.svelte"
import Caption from "./range-calendar-caption.svelte"
import Cell from "./range-calendar-cell.svelte"
import Day from "./range-calendar-day.svelte"
import Grid from "./range-calendar-grid.svelte"
import GridRow from "./range-calendar-grid-row.svelte"
import HeadCell from "./range-calendar-head-cell.svelte"
import Header from "./range-calendar-header.svelte"
import Heading from "./range-calendar-heading.svelte"
import Month from "./range-calendar-month.svelte"
import MonthSelect from "./range-calendar-month-select.svelte"
import Months from "./range-calendar-months.svelte"
import Nav from "./range-calendar-nav.svelte"
import NextButton from "./range-calendar-next-button.svelte"
import PrevButton from "./range-calendar-prev-button.svelte"
import YearSelect from "./range-calendar-year-select.svelte"

const GridHead = RangeCalendarPrimitive.GridHead
const GridBody = RangeCalendarPrimitive.GridBody

export {
  Day,
  Cell,
  Grid,
  Header,
  Months,
  GridRow,
  Heading,
  GridBody,
  GridHead,
  HeadCell,
  NextButton,
  PrevButton,
  MonthSelect,
  YearSelect,
  Caption,
  Nav,
  Month,
  //
  Root as RangeCalendar,
}
