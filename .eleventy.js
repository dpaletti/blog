const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownItKatex = require("@vscode/markdown-it-katex").default;
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs")

module.exports = function (eleventyConfig) {
    // passthrough
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

    const md = markdownIt({
        html: true,
        linkify: true,
    }).use(markdownItKatex).use(markdownItAttrs);

    eleventyConfig.setLibrary("md", md);

    // format date to YYYY-mm-dd
    eleventyConfig.addFilter("YearMonthDay", (dateString) => {
        dateObj = new Date(dateString);
        return dateObj.toJSON().slice(0, 10);
    });

    // Add prefix to make deployment work
    // gh-pages needs prefix for working
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

    eleventyConfig.addPlugin(pluginRss);

    return {
        dir: {
            input: "html",
            output: "_site",
            includes: "../_includes",
        },
    };
};
