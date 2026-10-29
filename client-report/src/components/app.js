// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import _ from "lodash";

import * as globals from "./globals";
import DataUtils from "../util/dataUtils";
import Header from "./framework/header";
import Footer from "./framework/Footer";
import Overview from "./overview";
import MajorityStrict from "./lists/majorityStrict";
import Uncertainty from "./lists/uncertainty";
import AllCommentsModeratedIn from "./lists/allCommentsModeratedIn";
import ParticipantGroups from "./lists/participantGroups";
import ParticipantsGraph from "./participantsGraph/participantsGraph";
import Beeswarm from "./beeswarm/beeswarm";
import { t, fmt } from "../strings";

import net from "../util/net";

var pathname = window.location.pathname; // "/report/2arcefpshi"
var report_id = pathname.split("/")[2];

function assertExists(obj, key) {
  if (typeof obj[key] === "undefined") {
    console.error("assertExists failed. Missing: ", key);
  }
}

// What went wrong, for the error state: an HTTP status from jQuery's jqXHR
// (the old code showed "[object Object]" for these) or a JS error.
function describeError(err) {
  if (err && typeof err.status === "number") {
    return { status: err.status };
  }
  return { message: err && err.message ? err.message : String(err) };
}

const State = ({ title, children }) => (
  <div className="state">
    <h1>{title}</h1>
    {children}
  </div>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      consensus: null,
      comments: null,
      participants: null,
      conversation: null,
      groupDemographics: null,
      colorBlindMode: false,
      shouldPoll: false,
    };
  }

  getMath(conversation_id) {
    return net
      .polisGet("/api/v3/math/pca2", {
        lastVoteTimestamp: 0,
        conversation_id: conversation_id,
      })
      .then((data) => data || {});
  }

  getComments(conversation_id, isStrictMod) {
    return net.polisGet("/api/v3/comments", {
      conversation_id: conversation_id,
      report_id: report_id,
      moderation: true,
      mod_gt: isStrictMod ? 0 : -1,
      include_voting_patterns: true,
    });
  }

  getParticipantsOfInterest(conversation_id) {
    return net.polisGet("/api/v3/ptptois", { conversation_id: conversation_id });
  }
  getConversation(conversation_id) {
    return net.polisGet("/api/v3/conversations", { conversation_id: conversation_id });
  }
  getReport(report_id) {
    return net.polisGet("/api/v3/reports", { report_id: report_id }).then((reports) => (reports.length ? reports[0] : null));
  }
  getGroupDemographics(conversation_id) {
    return net.polisGet("/api/v3/group_demographics", { conversation_id: conversation_id, report_id: report_id });
  }

  getData() {
    const reportPromise = this.getReport(report_id).then((report) => {
      if (!report) throw { status: 404 };
      return report;
    });
    const conversationPromise = reportPromise.then((report) => this.getConversation(report.conversation_id));
    const mathPromise = reportPromise.then((report) => this.getMath(report.conversation_id));
    const commentsPromise = reportPromise.then((report) =>
      conversationPromise.then((conv) => this.getComments(report.conversation_id, conv.strict_moderation))
    );
    // Only its length was ever used; a failure here must not hide the report.
    const groupDemographicsPromise = reportPromise
      .then((report) => this.getGroupDemographics(report.conversation_id))
      .catch(() => []);
    const participantsOfInterestPromise = reportPromise.then((report) => this.getParticipantsOfInterest(report.conversation_id));

    Promise.all([reportPromise, mathPromise, commentsPromise, groupDemographicsPromise, participantsOfInterestPromise, conversationPromise])
      .then((a) => {
        let [report, mathResult, comments, groupDemographics, participants, conversation] = a;

        // No maths yet (fewer than 7 voters), or a partial result while the
        // worker is still computing: nothing to show, not an error.
        const complete =
          mathResult &&
          ["group-votes", "group-clusters", "consensus", "tids", "user-vote-counts", "pca", "repness"].every(
            (k) => typeof mathResult[k] !== "undefined"
          ) &&
          mathResult.pca &&
          mathResult.pca["comment-extremity"];
        if (!complete) {
          this.setState({ loading: false, nothingToShow: true, conversation });
          return;
        }
        assertExists(mathResult, "base-clusters");
        assertExists(mathResult, "consensus");
        assertExists(mathResult, "group-aware-consensus");
        assertExists(mathResult, "group-clusters");
        assertExists(mathResult, "group-votes");
        assertExists(mathResult, "n-cmts");
        assertExists(mathResult, "repness");
        assertExists(mathResult, "pca");
        assertExists(mathResult, "tids");
        assertExists(mathResult, "user-vote-counts");
        assertExists(mathResult, "votes-base");
        if (mathResult && mathResult.pca) {
          assertExists(mathResult.pca, "center");
          assertExists(mathResult.pca, "comment-extremity");
          assertExists(mathResult.pca, "comment-projection");
          assertExists(mathResult.pca, "comps");
        }

        let indexToTid = mathResult.tids;

        // # ptpts that voted
        var ptptCountTotal = conversation.participant_count;

        // # ptpts that voted enough to be included in math
        var ptptCount = 0;
        _.each(mathResult["group-votes"], (val) => {
          ptptCount += val["n-members"];
        });

        let repfulAgreeTidsByGroup = {};
        let repfulDisageeTidsByGroup = {};
        if (mathResult.repness) {
          _.each(mathResult.repness, (entries, gid) => {
            entries.forEach((entry) => {
              if (entry["repful-for"] === "agree") {
                repfulAgreeTidsByGroup[gid] = repfulAgreeTidsByGroup[gid] || [];
                repfulAgreeTidsByGroup[gid].push(entry.tid);
              } else if (entry["repful-for"] === "disagree") {
                repfulDisageeTidsByGroup[gid] = repfulDisageeTidsByGroup[gid] || [];
                repfulDisageeTidsByGroup[gid].push(entry.tid);
              }
            });
          });
        }

        // gids start at zero; the report shows them as A, B, C or the custom label
        let groupNames = {};
        for (let i = 0; i <= 9; i++) {
          let label = report["label_group_" + i];
          if (label) {
            groupNames[i] = label;
          }
        }

        let uncertainty = [];
        comments.map((c) => {
          var unc = c.pass_count / c.count;
          if (unc > globals.uncertaintyThreshold) {
            c.unc = unc;
            uncertainty.push(c);
          }
        });
        uncertainty.sort((a, b) => {
          return b.unc * b.unc * b.pass_count - a.unc * a.unc * a.pass_count;
        });
        uncertainty = uncertainty.slice(0, 5);

        let extremity = {};
        if (mathResult && mathResult.pca) {
          _.each(mathResult.pca["comment-extremity"], function (e, index) {
            extremity[indexToTid[index]] = e;
          });
        }

        var uniqueCommenters = {};
        var voteTotals = DataUtils.getVoteTotals(mathResult);
        comments = comments.map((c) => {
          c["group-aware-consensus"] = mathResult["group-aware-consensus"][c.tid];
          uniqueCommenters[c.pid] = 1;
          c = Object.assign(c, voteTotals[c.tid]);
          return c;
        });
        var numUniqueCommenters = _.keys(uniqueCommenters).length;
        var totalVotes = _.reduce(
          _.values(mathResult["user-vote-counts"]),
          function (memo, num) {
            return memo + num;
          },
          0
        );
        const computedStats = {
          votesPerVoterAvg: ptptCountTotal ? totalVotes / ptptCountTotal : 0,
          commentsPerCommenterAvg: numUniqueCommenters ? comments.length / numUniqueCommenters : 0,
        };

        this.setState({
          loading: false,
          error: false,
          math: mathResult,
          consensus: mathResult.consensus,
          extremity: extremity,
          uncertainty: uncertainty.map((c) => c.tid),
          comments: comments,
          demographics: groupDemographics,
          participants: participants,
          conversation: conversation,
          ptptCount: ptptCount,
          ptptCountTotal: ptptCountTotal,
          badTids: {},
          groupNames: groupNames,
          repfulAgreeTidsByGroup: repfulAgreeTidsByGroup,
          repfulDisageeTidsByGroup: repfulDisageeTidsByGroup,
          report: report,
          computedStats: computedStats,
          nothingToShow: !comments.length || !_.size(mathResult["group-votes"]),
        });
      })
      .catch((err) => {
        console.error("report load failed", err);
        this.setState({ loading: false, error: true, errorInfo: describeError(err) });
      });
  }

  UNSAFE_componentWillMount() {
    this.getData();
    setInterval(() => {
      if (this.state.shouldPoll) {
        this.getData();
      }
    }, 20 * 1000);
  }

  render() {
    const { colorBlindMode, conversation } = this.state;
    const header = (
      <Header
        conversation={conversation}
        autoRefresh={this.state.shouldPoll}
        onAutoRefresh={(on) => this.setState({ shouldPoll: on })}
        colorBlind={colorBlindMode}
        onColorBlind={(on) => this.setState({ colorBlindMode: on })}
      />
    );
    const cls = "report" + (colorBlindMode ? " report--cb" : "");

    if (this.state.error) {
      const info = this.state.errorInfo || {};
      return (
        <div className={cls}>
          <State title={t("errorTitle")}>
            {info.status ? <p>{fmt("errorHttp", { status: info.status })}</p> : <p>{fmt("errorOther", { error: info.message })}</p>}
            {info.status === 403 || info.status === 401 ? <p>{t("errorHint403")}</p> : null}
            {info.status === 404 || info.status === 400 ? <p>{t("errorHint404")}</p> : null}
          </State>
        </div>
      );
    }
    if (this.state.loading) {
      return (
        <div className={cls}>
          <State title={t("loading")} />
        </div>
      );
    }
    if (this.state.nothingToShow) {
      return (
        <div className={cls}>
          {header}
          <State title={t("nothingTitle")}>
            <p>{t("nothingText")}</p>
          </State>
          <Footer />
        </div>
      );
    }
    const common = {
      math: this.state.math,
      comments: this.state.comments,
      conversation: this.state.conversation,
      ptptCount: this.state.ptptCount,
      groupNames: this.state.groupNames,
    };
    return (
      <div className={cls}>
        {header}
        <div className="report__sections">
          <Overview
            computedStats={this.state.computedStats}
            math={this.state.math}
            ptptCount={this.state.ptptCount}
            ptptCountTotal={this.state.ptptCountTotal}
            conversation={this.state.conversation}
          />
          <Beeswarm {...common} extremity={this.state.extremity} />
          <MajorityStrict {...common} consensus={this.state.consensus} />
          <ParticipantGroups {...common} />
          <Uncertainty {...common} uncertainty={this.state.uncertainty} />
          <ParticipantsGraph {...common} badTids={this.state.badTids} />
          <AllCommentsModeratedIn {...common} />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
