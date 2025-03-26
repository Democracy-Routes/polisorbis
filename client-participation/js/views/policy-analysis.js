// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

var Handlebones = require("handlebones");
var template = require("../templates/policy-analysis.handlebars");
var { markdown } = require('markdown');
var Utils = require("../util/utils");
var Strings = require("../strings");
var $ = require("jquery");

var iOS = Utils.isIos();

module.exports = Handlebones.ModelView.extend({
    name: "policy-analysis",
    template: template,
    events: {
        "click #openIDButtonPolicyView": "openIDClicked",
        "click #policyAnalysisBtn": "policyAnalysisBtn"
    },
    context: function () {
        var ctx = Handlebones.ModelView.prototype.context.apply(this, arguments);
        ctx.iOS = iOS;

        ctx.s = Strings;

        ctx.auth_opt_openid_computed = preload.firstConv.auth_opt_openid_computed;
        console.log(this.model);

        console.log(this.model.get("needSocial"));
        ctx.needSocial = this.model.get("needSocial");

        return ctx;
    },

    initialize: function (options) {
        Handlebones.ModelView.prototype.initialize.apply(this, arguments);
        var that = this;
        this.model = options.model;
        var conversation_id = this.conversation_id = options.conversation_id;

        this.openIDClicked = function (e) {
            var dest = window.location.pathname + window.location.hash;
            window.location = "/api/v3/openidBtn?dest=" + dest;
        },
    
        this.policyAnalysisBtn = function () {
            var id_token = Utils.getCookie("id_token");
            var convId = conversation_id;

            //Overwrite id_token and convId for testing
            
            $.ajax({
                url: `https://orbis.api.kubecore.eu-dev.novelcore.org/results?source=polis&topic_id=${convId}`,
                type: "GET",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', `Bearer ${id_token}`);
                },
                error: function(err) {
                    console.log("Error");
                    console.error(err);
                    that.model.set({
                        needSocial: true
                    });
                },
                success: function(data) {
                    data.analysis_results = JSON.parse(data.analysis_results);
                    data.policy_results = JSON.parse(data.policy_results);
                    const clusters = Object.groupBy(data.analysis_results, ({ cluster_id }) => cluster_id);
                    const policyAnalysisResult = data.policy_results;
                    for (var cluster_id of Object.keys(clusters)) {
                        if (!(cluster_id in policyAnalysisResult)) {
                            policyAnalysisResult[cluster_id] = {};
                        }
                        policyAnalysisResult[cluster_id]["comments"] = clusters[cluster_id];
                        if (clusters[cluster_id].length > 0) {
                            policyAnalysisResult[cluster_id]["summary"] = clusters[cluster_id][0].summary;
                        }
                    }
                    var text = "![](https://orbis-project.eu/wp-content/uploads/2024/11/ORBIS_logo_noclaim_C-2048x944-2-300x90.png)\n\n# Policy Analysis (powered by [Orbis Project](https://orbis-project.eu/))\n";
                    for (var cluster_id of Object.keys(policyAnalysisResult)) {
                        if (policyAnalysisResult[cluster_id].cluster_title) {
                            text += `## ${policyAnalysisResult[cluster_id].cluster_title}\n${policyAnalysisResult[cluster_id].summary}\n### Recommendations:\n${policyAnalysisResult[cluster_id].recommendations}\n`;
                        }
                        else {
                            text += `## Unrecognized Cluster ${cluster_id}\n`;
                        }
                        text += "### PolisOrbis statements\n| statemet | agree | disagree | pass |\n|----------|-------|----------|------|\n";
                        text += policyAnalysisResult[cluster_id].comments.map((c) => `| ${c.txt} | ${c.agree_count} (${Math.round(c.agree_count / c.count * 100)}%) | ${c.disagree_count} (${Math.round(c.disagree_count / c.count * 100)}%) | ${c.pass_count} (${Math.round(c.pass_count / c.count * 100)}%) |\n`).join("");
                    }
                    htmlText = markdown.toHTML(text, 'Maruku');
                    var newWindow = window.open();
                    var title = "Policy Analysis Result";
                    newWindow.document.open();
                    newWindow.document.writeln(`<html><head><title>${title}</title></head><body>${htmlText}</body></html>`);
                    newWindow.document.close();
                }
            });
        }
    }
});
