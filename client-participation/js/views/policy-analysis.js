// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

var Handlebones = require("handlebones");
var template = require("../templates/policy-analysis.handlebars");
var { markdown } = require("markdown");
var URLs = require("../util/url");
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
        this.serverClient = options.serverClient;
        var conversation_id = this.conversation_id = options.conversation_id;
        this.baseUrl = URLs.urlPrefix;

        this.openIDClicked = function (e) {
            var dest = window.location.pathname + window.location.hash;
            window.location = "/api/v3/openidBtn?dest=" + dest;
        },

            this.policyAnalysisBtn = function () {
                var id_token = Utils.getCookie("id_token");
                var convId = conversation_id;
                var baseUrl = that.baseUrl;

                //Overwrite id_token and convId for testing

                $.ajax({
                    url: `https://orbis.api.kubecore.eu-dev.novelcore.org/results?source=polis&topic_id=${convId}`,
                    type: "GET",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", `Bearer ${id_token}`);
                    },
                    error: function (err) {
                        console.error(err);
                        that.model.set({
                            needSocial: true
                        });
                    },
                    success: function (data) {
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
                        htmlText = markdown.toHTML(text, "Maruku");
                        var newWindow = window.open();
                        var title = "Policy Analysis Result";
                        var policyAnalysisPage = 
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 2rem;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
            /* <-- makes column widths equal */
            table-layout: fixed;
        }

        .question-cell {
            padding: 0.75rem;
            text-align: center;
            border: 1px solid #ccc;
            width: 40%;
            /* 6 columns = 100% / 6 */
        }

        .rating-cell {
            padding: 0.75rem;
            text-align: center;
            border: 1px solid #ccc;
            width: 12%;
            /* 6 columns = 100% / 6 */
        }

        .label-text {
            display: block;
            font-size: 0.75rem;
            color: #555;
            margin-top: 0.2rem;
        }

        input {
            cursor: pointer;
        }

        .submit-button {
            padding: 0.5rem 1rem;
            background-color: #03a9f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .submit-button:disabled {
            background-color: #b3e5fc;
            color: rgb(100, 100, 100);
            cursor: not-allowed;
            opacity: 0.6;
        }

        .download-button {
            padding: 0.5rem 1rem;
            background-color: rgb(235, 235, 235);
            color: rgb(100, 100, 100);
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    </style>
</head>

<body>
    <div>${htmlText}</div>
    <h2 style="margin-top: 4rem;">Rate your Orbis experience</h2>
    <form id="reviewForm">
        <table>
            <thead>
                <tr>
                    <th class="question-cell"></th>
                    <th class="rating-cell">1</th>
                    <th class="rating-cell">2</th>
                    <th class="rating-cell">3</th>
                    <th class="rating-cell">4</th>
                    <th class="rating-cell">5</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="question-cell">How do you rate the clarity and quality of this output?</td>
                    <td class="rating-cell"><input type="radio" name="1" value="1" required /><span
                            class="label-text">Very Poor</span></td>
                    <td class="rating-cell"><input type="radio" name="1" value="2" /><span
                            class="label-text">Poor</span></td>
                    <td class="rating-cell"><input type="radio" name="1" value="3" checked /><span
                            class="label-text">Average</span></td>
                    <td class="rating-cell"><input type="radio" name="1" value="4" /><span
                            class="label-text">Good</span></td>
                    <td class="rating-cell"><input type="radio" name="1" value="5" /><span
                            class="label-text">Excellent</span></td>
                </tr>
                <tr>
                    <td class="question-cell">How do you rate the easiness of use?</td>
                    <td class="rating-cell"><input type="radio" name="2" value="1" required /><span
                            class="label-text">Very Poor</span></td>
                    <td class="rating-cell"><input type="radio" name="2" value="2" /><span
                            class="label-text">Poor</span></td>
                    <td class="rating-cell"><input type="radio" name="2" value="3" checked /><span
                            class="label-text">Average</span></td>
                    <td class="rating-cell"><input type="radio" name="2" value="4" /><span
                            class="label-text">Good</span> </td>
                    <td class="rating-cell"><input type="radio" name="2" value="5" /><span
                            class="label-text">Excellent</span></td>
                </tr>
                <tr>
                    <td class="question-cell">How much do you think it can support the discussion (present and future)?
                    </td>
                    <td class="rating-cell"><input type="radio" name="3" value="1" required /><span
                            class="label-text">Not at all</span></td>
                    <td class="rating-cell"><input type="radio" name="3" value="2" /><span class="label-text">A
                            little</span></td>
                    <td class="rating-cell"><input type="radio" name="3" value="3" checked /><span
                            class="label-text">Moderately</span></td>
                    <td class="rating-cell"><input type="radio" name="3" value="4" /><span class="label-text">Quite a
                            bit</span></td>
                    <td class="rating-cell"><input type="radio" name="3" value="5" /><span class="label-text">Very
                            much</span></td>
                </tr>
                <tr>
                    <td class="question-cell">How likely would you be to use it again?</td>
                    <td class="rating-cell"><input type="radio" name="4" value="1" required /><span
                            class="label-text">Not Likely</span></td>
                    <td class="rating-cell"><input type="radio" name="4" value="2" /><span class="label-text">Slightly
                            unlikely</span></td>
                    <td class="rating-cell"><input type="radio" name="4" value="3" checked /><span
                            class="label-text">Moderately</span></td>
                    <td class="rating-cell"><input type="radio" name="4" value="4" /><span class="label-text">Very
                            likely</span></td>
                    <td class="rating-cell"><input type="radio" name="4" value="5" /><span class="label-text">Extremely
                            likely</span></td>
                </tr>
            </tbody>
        </table>
    </form>
    <button id="submitBtn" class="submit-button" type="button" onclick="handleSubmit(event)">Submit Review</button>
    <button id="downloadBtn" class="download-button" type="button" onclick="downloadReviews(event)">Download Reviews</button>
    <script>
        function handleSubmit(event) {
            event.preventDefault();
            const form = document.getElementById("reviewForm");
            const submitBtn = document.getElementById("submitBtn");

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            for (const [key, value] of Object.entries(data)) {
                const reviewObj = {
                    conversation_id: "${convId}",
                    question_id: parseInt(key),
                    rating_value: parseInt(value)
                };
                fetch("${baseUrl}api/v3/policy-analysis/rewiews", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reviewObj)
                });
            }
            submitBtn.textContent = "Review submitted";
            submitBtn.disabled = true;
        }

        async function downloadReviews(event) {
            event.preventDefault()
            const response = await fetch("${baseUrl}api/v3/policy-analysis/rewiews?conversation_id=${convId}", {
                method: "GET"
            });

            if (!response.ok) {
                alert("Failed to download file. This may happen because the file doesn't exist yet.");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "${convId}" + ".csv";
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>`;
                        newWindow.document.open();
                        newWindow.document.writeln(policyAnalysisPage);
                        newWindow.document.close();
                    }
                });
            }
    }
});
