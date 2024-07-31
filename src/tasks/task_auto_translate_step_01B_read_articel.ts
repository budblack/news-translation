import { move, readFile } from "fs-extra";
import { main_options } from "..";
import { join } from "path";

export async function task_auto_translate_step_01B_read_articel(options: main_options) {
    const { with_orginal_markdown_file_path } = options;
    /** **********************************************************************************************************************************
     *  Article markdown file should be start like:
     * ---
     * title: Bash スクリプトチュートリアル – 初心者向けの Linux シェルスクリプトとコマンドライン
     * date: 2024-07-17T12:41:14.502Z
     * authorURL: ""
     * originalURL: https://www.freecodecamp.org/japanese/news/bash-scripting-tutorial-linux-shell-script-and-command-line-for-beginners/
     * translator: ""
     * reviewer: ""
     * ---
     *************************************************************************************************************************************/

    const str_md = await readFile(with_orginal_markdown_file_path, 'utf-8');
    const arr_str_md = str_md.split('\n\n');
    let str_title = '', str_date = '', str_author_url = '', str_original_url = '', str_translator = '', str_reviewer = '';
    let count_flag_scan = 0;
    for (let i = 0; i < arr_str_md.length; i++) {
        const str = arr_str_md[i];
        if (str === '---') { count_flag_scan += 1 }
        if (count_flag_scan === 1) {
            if (str.startsWith('title: ')) str_title = str.replace('title: ', '').trim();
            else if (str.startsWith('date: ')) str_date = str.replace('date: ', '').trim();
            else if (str.startsWith('authorURL: ')) str_author_url = str.replace('authorURL: ', '').trim();
            else if (str.startsWith('originalURL: ')) str_original_url = str.replace('originalURL: ', '').trim();
            else if (str.startsWith('translator: ')) str_translator = str.replace('translator: ', '').trim();
            else if (str.startsWith('reviewer: ')) str_reviewer = str.replace('reviewer: ', '').trim();
        }
        if (count_flag_scan === 2) break;
    }

    // Move the original markdown file to the target directory, to keep original directory clean.
    const markdown_file_name = with_orginal_markdown_file_path.split('/').pop();
    await move(with_orginal_markdown_file_path, join(options.with_task_fetch_to_save_path, markdown_file_name), { overwrite: true });

    const original_meta = {
        title: str_title,
        date: str_date,
        authorURL: str_author_url,
        originalURL: str_original_url,
        translator: str_translator,
        reviewer: str_reviewer
    }
    // Manually assign the meta and markdown file path to the options
    Object.assign(options, {
        step_01_result_mdfiles: [with_orginal_markdown_file_path],
        step_01_result_metas: [original_meta]
    });

    return;
}
