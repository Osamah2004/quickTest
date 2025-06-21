import tkinter as tk
from tkinter import messagebox
import os
import json

class JSONCombinerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Combine JSON Questions")
        self.directory = os.path.dirname(os.path.abspath(__file__))
        self.file_vars = []
        self.file_checkbuttons = []
        self.json_files = []

        # Info label
        self.info_label = tk.Label(root, text=f"Directory: {self.directory}")
        self.info_label.pack(pady=10)

        # Files list
        self.files_frame = tk.LabelFrame(root, text="Select JSON files to combine")
        self.files_frame.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)
        self.list_json_files()

        # Output file name
        self.out_frame = tk.Frame(root)
        self.out_frame.pack(pady=10)
        tk.Label(self.out_frame, text="Output file name:").pack(side=tk.LEFT)
        self.out_entry = tk.Entry(self.out_frame, width=30)
        self.out_entry.pack(side=tk.LEFT, padx=5)
        tk.Label(self.out_frame, text=".json").pack(side=tk.LEFT)

        # Combine button
        self.combine_button = tk.Button(root, text="Combine and Save", command=self.combine_files)
        self.combine_button.pack(pady=10)

    def list_json_files(self):
        # Clear previous
        for cb in self.file_checkbuttons:
            cb.destroy()
        self.file_vars.clear()
        self.file_checkbuttons.clear()
        self.json_files = [f for f in os.listdir(self.directory) if f.endswith('.json') and f != os.path.basename(__file__)]
        for fname in self.json_files:
            var = tk.BooleanVar()
            cb = tk.Checkbutton(self.files_frame, text=fname, variable=var)
            cb.pack(anchor='w')
            self.file_vars.append(var)
            self.file_checkbuttons.append(cb)

    def combine_files(self):
        selected_files = [f for f, v in zip(self.json_files, self.file_vars) if v.get()]
        out_name = self.out_entry.get().strip()
        if not selected_files:
            messagebox.showerror("Error", "No files selected.")
            return
        if not out_name:
            messagebox.showerror("Error", "Please enter an output file name.")
            return
        combined_questions = []
        for fname in selected_files:
            try:
                with open(os.path.join(self.directory, fname), 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, dict) and 'questions' in data and isinstance(data['questions'], list):
                        combined_questions.extend(data['questions'])
                    else:
                        messagebox.showerror("Error", f"File {fname} does not have a 'questions' array.")
                        return
            except Exception as e:
                messagebox.showerror("Error", f"Failed to read {fname}: {e}")
                return
        out_path = os.path.join(self.directory, out_name + '.json')
        try:
            with open(out_path, 'w', encoding='utf-8') as f:
                json.dump({'questions': combined_questions}, f, indent=2, ensure_ascii=False)
            messagebox.showinfo("Success", f"Combined file saved as {out_path}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to write output file: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = JSONCombinerApp(root)
    root.mainloop() 