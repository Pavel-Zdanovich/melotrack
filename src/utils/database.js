import {Octokit} from "https://cdn.skypack.dev/octokit?dts";

const GITHUB_ACCESS_TOKEN = ``;//await fetch(`.env`).then(response => response.text());

const octokit = new Octokit({
    auth: GITHUB_ACCESS_TOKEN
});

const path = `data.json`;

export const get = async () => fetch(path).then(response => response.json());

export const pull = async () => {
    return octokit.request(
        `GET /repos/{owner}/{repo}/contents/{path}`,
        {
            owner: `Pavel-Zdanovich`,
            repo: `melotrack`,
            path: path
        }
    );
};

export const push = async (content, sha) => {
    return octokit.request(
        `PUT /repos/{owner}/{repo}/contents/{path}`,
        {
            owner: `Pavel-Zdanovich`,
            repo: `melotrack`,
            path: path,
            message: `TODO`,
            content: content,
            sha: sha//file.data.sha
        }
    );
};
