import { Component, OnInit } from '@angular/core'
import embed, { VisualizationSpec } from 'vega-embed'
import { _2021 } from 'src/app/pages/dashboard-page/data/2021'
import { _2020 } from 'src/app/pages/dashboard-page/data/2020'

@Component( {
  selector: 'plutus-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
} )
export class DashboardPageComponent implements OnInit {
  spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'Expenditure Throughout 2021',
    data: {
      values: _2021.concat( _2020 ),
    },
    mark: 'circle',
    width: 300,
    height: 320,
    encoding: {
      x: { field: 'date', type: 'temporal', timeUnit: 'yearmonth' },
      y: { field: 'amount', type: 'quantitative' },
      size: { field: 'amount', type: 'quantitative' },
      tooltip: { field: 'amount' },
      color: { field: 'category', type: 'nominal', scale: {
        range: ['paleturquoise', 'gold', 'steelblue', 'darkgrey']
      } }
    },
  }

  constructor() {
  }

  ngOnInit(): void {
    embed( '#vis', this.spec )
  }
}
