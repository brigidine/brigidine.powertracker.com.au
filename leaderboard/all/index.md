---
title: Full Leader Board
layout: default
bodyclass: "page-leaderboard"
---

{% assign leaders = site.data.leaders.scores | sort: "name" | sort: "score" | reverse %}

<section class="container">
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-sm-push-3 students">

      {% for leader in leaders %}
      <div class="row">
        <div class="col-xs-1 student-rank">{{ forloop.index }}</div>
        <div class="col-xs-2 student-image"><img src="/avatar/{{ leader.image }}" class="center-block img-responsive" alt="" /></div>
        <div class="col-xs-6 student-bar">
          <div class="progress">
            <div class="progress-bar" role="progressbar" aria-valuenow="{{ leader.score }}" aria-valuemin="0" aria-valuemax="100" style="width: {{ leader.score | divided_by: site.data.leaders.totalpoints }}%;">
              {{ leader.score }}
            </div>
          </div>
          <div>
            {{ leader.name }}
          </div>
        </div>
        <div class="col-xs-3 student-score text-right">{{ leader.score }}</div>
      </div>
      {% endfor %}

    </div>
  </div>
</section>
