import {
	Plugin,
} from "obsidian";
import {
	DEFAULT_SETTINGS,
	LlmSummarySettings,
	LlmSummarySettingsTab
} from "./settings";
import { FalconSummaryModel } from "modals/SummaryModal";


// Remember to rename these classes and interfaces!

export default class LlmSummaryPlugin extends Plugin {
	settings: LlmSummarySettings;

	async onload() {
		await this.loadSettings();

		const llm_models = [
			{
				label: "Falcon summarizer",
				onClick: (text:string) => {
					new FalconSummaryModel(this.app, text, this).open();
				},
			},
		];


		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				const selected_text = editor.getSelection();
				if (!selected_text) return;

				menu.addItem((item) => {
					item.setTitle("Llm summary")
						.setIcon("pencil")
						.setDisabled(true);
				});
				menu.addSeparator();

				llm_models.forEach((model) => {
					menu.addItem((item) => {
						item.setTitle(model.label)
							.setIcon("dot")
							.onClick(() => model.onClick(selected_text));
					});
				});

			})
		);

		this.addSettingTab(new LlmSummarySettingsTab(this.app, this));

	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<LlmSummarySettings>
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
