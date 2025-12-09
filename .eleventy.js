const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
    // passthrough
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

    // format date to YYYY-mm-dd
    eleventyConfig.addFilter("YearMonthDay", (dateString) => {
        dateObj = new Date(dateString);
        return dateObj.toJSON().slice(0, 10);
    });

    // Add prefix to make deployment work
    // gh-pages needs prefix for working
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

    // RSS feed
    eleventyConfig.addPlugin(feedPlugin, {
        type: "atom", // or "rss", "json"
        outputPath: "/html/blog/feed.xml",
        collection: {
            name: "blog_post",
            limit: 10, // 0 means no limit
        },
        metadata: {
            language: "en",
            title: "Daniele Paletti - blog",
            subtitle: "Latest articles.",
            base: "https://dpaletti.com/blog/",
            author: {
                name: "Daniele Paletti",
                email: "",
            },
        },
    });

    return {
        dir: {
            input: "html",
            output: "_site",
            includes: "../_includes",
        },
    };
};
