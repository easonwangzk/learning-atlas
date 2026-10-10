import { getLabResult, type ChartModel, type LabKind, type LabLocale, type LabResult, type ResultSection } from "@/lib/labCalculators";

const svgNamespace = "http://www.w3.org/2000/svg";

function text(locale: LabLocale) {
  return {
    metric: locale === "en" ? "Metric" : "指标",
    value: locale === "en" ? "Value" : "值",
    unit: locale === "en" ? "Unit" : "单位",
    keyResults: locale === "en" ? "Key results" : "关键结果",
    unexpected: locale === "en" ? "Unexpected lab failure. Please check the console." : "实验发生意外错误。请查看控制台。",
    invalid: locale === "en" ? "Check this field. It must match the required range and step." : "请检查此字段。它必须符合范围和步长要求。"
  };
}

function removeChildren(element: Element) {
  while (element.firstChild) element.removeChild(element.firstChild);
}

function appendText<K extends keyof HTMLElementTagNameMap>(parent: Node, tag: K, value: string, className?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  parent.appendChild(element);
  return element;
}

function appendSvgText(parent: SVGElement, x: number, y: number, value: string): SVGTextElement {
  const element = document.createElementNS(svgNamespace, "text");
  element.setAttribute("x", String(x));
  element.setAttribute("y", String(y));
  element.textContent = value;
  parent.appendChild(element);
  return element;
}

function appendSvgRect(parent: SVGElement, x: number, y: number, width: number, height: number, className: string) {
  const rect = document.createElementNS(svgNamespace, "rect");
  rect.setAttribute("x", String(x));
  rect.setAttribute("y", String(y));
  rect.setAttribute("width", String(Math.max(0, width)));
  rect.setAttribute("height", String(height));
  rect.setAttribute("rx", "3");
  rect.setAttribute("class", className);
  parent.appendChild(rect);
}

function renderTable(parent: HTMLElement, section: ResultSection, locale: LabLocale) {
  const sectionElement = document.createElement("section");
  sectionElement.className = "lab-result-section";
  appendText(sectionElement, "h3", section.title);
  const table = document.createElement("table");
  table.className = "lab-data-table";
  table.dataset.labTable = "";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const heading of [text(locale).metric, text(locale).value, text(locale).unit]) appendText(headRow, "th", heading).scope = "col";
  thead.appendChild(headRow);
  table.appendChild(thead);
  const tbody = document.createElement("tbody");
  for (const row of section.rows) {
    const tr = document.createElement("tr");
    appendText(tr, "th", row.label).scope = "row";
    appendText(tr, "td", row.value);
    appendText(tr, "td", row.unit ?? "");
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  sectionElement.appendChild(table);
  parent.appendChild(sectionElement);
}

function renderResults(output: HTMLElement, result: LabResult, locale: LabLocale) {
  removeChildren(output);
  const sections: readonly ResultSection[] = [{ title: text(locale).keyResults, rows: result.summaryRows }, ...result.detailSections];
  for (const section of sections) renderTable(output, section, locale);
  const list = document.createElement("ul");
  for (const note of result.notes) appendText(list, "li", note);
  output.appendChild(list);
}

function renderChart(svg: SVGSVGElement, chart: ChartModel) {
  removeChildren(svg);
  const rowHeight = Math.max(28, chart.series.length * 16);
  const height = Math.max(180, 64 + chart.labels.length * rowHeight);
  svg.setAttribute("viewBox", `0 0 640 ${height}`);
  const titleId = `${svg.id || "lab-chart"}-title`;
  svg.setAttribute("aria-labelledby", titleId);
  const title = document.createElementNS(svgNamespace, "title");
  title.id = titleId;
  title.textContent = chart.title;
  svg.appendChild(title);
  const legend = document.createElementNS(svgNamespace, "g");
  legend.setAttribute("class", "chart-legend");
  legend.setAttribute("aria-hidden", "true");
  chart.series.forEach((series, index) => {
    const group = document.createElementNS(svgNamespace, "g");
    group.setAttribute("transform", `translate(${140 + index * 180} 18)`);
    appendSvgRect(group, 0, 0, 14, 10, index === 0 ? "bar-fill" : "bar-compare");
    appendSvgText(group, 20, 10, series.name);
    legend.appendChild(group);
  });
  svg.appendChild(legend);
  const max = Math.max(1, ...chart.series.flatMap((series) => series.values));
  chart.labels.forEach((label, labelIndex) => {
    const group = document.createElementNS(svgNamespace, "g");
    const y = 48 + labelIndex * rowHeight;
    appendSvgText(group, 8, y + 14, label);
    chart.series.forEach((series, seriesIndex) => {
      const value = series.values[labelIndex] ?? 0;
      const width = Math.round((value / max) * 360);
      const barY = y + seriesIndex * 14;
      appendSvgRect(group, 190, barY, width, 10, seriesIndex === 0 ? "bar-fill" : "bar-compare");
      appendSvgText(group, 200 + width, barY + 10, `${value} ${chart.unit}`);
    });
    svg.appendChild(group);
  });
}

function readNumber(form: HTMLFormElement, name: string): number {
  const control = form.elements.namedItem(name);
  if (!(control instanceof HTMLInputElement)) throw new RangeError(`${name}: missing input`);
  return Number(control.value);
}

function readResult(kind: LabKind, form: HTMLFormElement, locale: LabLocale): LabResult {
  if (kind === "compute") return getLabResult(kind, { rps: readNumber(form, "rps"), cpuMs: readNumber(form, "cpuMs"), cores: readNumber(form, "cores"), headroom: readNumber(form, "headroom") }, locale);
  if (kind === "storage") return getLabResult(kind, { rpo: readNumber(form, "rpo"), backupAge: readNumber(form, "backupAge"), rto: readNumber(form, "rto"), copy: readNumber(form, "copy"), restore: readNumber(form, "restore"), validate: readNumber(form, "validate") }, locale);
  if (kind === "network") return getLabResult(kind, { prefix: readNumber(form, "prefix") }, locale);
  if (kind === "database") return getLabResult(kind, { records: readNumber(form, "records"), buckets: readNumber(form, "buckets") }, locale);
  if (kind === "ai") return getLabResult(kind, { k: readNumber(form, "k") }, locale);
  return getLabResult(kind, { tp: readNumber(form, "tp"), fp: readNumber(form, "fp"), fn: readNumber(form, "fn"), tn: readNumber(form, "tn") }, locale);
}

function fieldFromRangeError(error: RangeError): string | null {
  const [field] = error.message.split(":");
  return field && /^[A-Za-z][A-Za-z0-9]*$/.test(field) ? field : null;
}

function markRangeError(form: HTMLFormElement, error: RangeError, locale: LabLocale) {
  const field = fieldFromRangeError(error);
  const control = field ? form.elements.namedItem(field) : null;
  if (control instanceof HTMLInputElement) {
    const label = control.dataset.label || control.name;
    const message = `${label}: ${text(locale).invalid}`;
    control.setCustomValidity(message);
    control.reportValidity();
    control.setCustomValidity("");
  }
}

function setupPanel(panel: HTMLElement) {
  const form = panel.querySelector<HTMLFormElement>("[data-lab-form]");
  const output = panel.querySelector<HTMLElement>("[data-lab-results]");
  const chart = panel.querySelector<SVGSVGElement>("[data-lab-chart]");
  const rawKind = panel.dataset.lab;
  const kind: LabKind | null = rawKind === "compute" || rawKind === "storage" || rawKind === "network" || rawKind === "database" || rawKind === "ai" || rawKind === "ml" ? rawKind : null;
  const locale: LabLocale = panel.dataset.labLocale === "zh" ? "zh" : "en";
  if (!form || !output || !chart || !kind) throw new Error("Incomplete lab panel configuration");

  const render = () => {
    for (const input of form.querySelectorAll<HTMLInputElement>("input")) input.setCustomValidity("");
    if (!form.checkValidity()) {
      const badInput = form.querySelector<HTMLInputElement>("input:invalid");
      if (badInput) badInput.setCustomValidity(`${badInput.dataset.label || badInput.name}: ${text(locale).invalid}`);
      form.reportValidity();
      if (badInput) badInput.setCustomValidity("");
      return;
    }
    try {
      const result = readResult(kind, form, locale);
      renderResults(output, result, locale);
      renderChart(chart, result.chart);
    } catch (error) {
      if (error instanceof RangeError) {
        markRangeError(form, error, locale);
        return;
      }
      console.error("Learning Atlas lab failed unexpectedly.", error);
      output.textContent = text(locale).unexpected;
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });
  form.addEventListener("reset", () => window.setTimeout(render, 0));
  render();
}

export function setupLabs() {
  document.querySelectorAll<HTMLElement>("[data-lab]").forEach(setupPanel);
}
