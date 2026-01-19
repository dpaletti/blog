import re
import argparse
import sys

def convert_latex_delimiters(text):
    """
    Replaces custom latex block and inline tags with standard markdown delimiters.

    ${latex.block[[...]]} -> $$...$$
    ${latex.inline[[...]]} -> $...$
    """

    # Pattern for block latex: ${latex.block[[ content ]]}
    # We use non-greedy capture (.*?) to handle multiple blocks correctly
    block_pattern = r"\$\{latex\.block\[\[(.*?)\]\]\}"

    # Pattern for inline latex: ${latex.inline[[ content ]]}
    inline_pattern = r"\$\{latex\.inline\[\[(.*?)\]\]\}"

    # Replace blocks with $$ content $$
    # The \1 refers to the captured content inside the [[ ]]
    text = re.sub(block_pattern, r"$$\1$$", text, flags=re.DOTALL)

    # Replace inline with $ content $
    text = re.sub(inline_pattern, r"$\1$", text, flags=re.DOTALL)

    return text

def main():
    parser = argparse.ArgumentParser(
        description="Convert custom ${latex...} tags to standard Markdown $ and $$."
    )
    parser.add_argument("input", help="Path to the input markdown file")
    parser.add_argument("-o", "--output", help="Path to the output file (optional; defaults to stdout)")

    args = parser.parse_args()

    try:
        with open(args.input, 'r', encoding='utf-8') as f:
            content = f.read()

        converted = convert_latex_delimiters(content)

        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(converted)
            print(f"Successfully converted and saved to: {args.output}")
        else:
            # Print to terminal if no output file is specified
            sys.stdout.write(converted)

    except FileNotFoundError:
        print(f"Error: The file '{args.input}' was not found.")
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
