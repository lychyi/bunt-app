import { Component, OnInit } from '@angular/core';
import { TeamsListService } from '../../../shared/services/teams-list.service';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'bunt-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit {
  id: string;
  detail: any;
  roster: string[];

  constructor(
    private teamsListService: TeamsListService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.teamsListService.getTeams().switchMap(res => {
      const keys = Object.keys(res);

      // Flatten one layer deep to get a dictionary of all teams
      const teams = keys.reduce((acc, key) => {
        return {...acc, ...res[key]};
      }, {});

      this.detail = teams[this.id];

      if (this.detail) {
        return this.teamsListService.getRostersForTeam(this.detail.documentName);
      } else {
        return Observable.of([]);
      }
    }).subscribe(roster => {
      this.roster = roster;
    });
  }

}