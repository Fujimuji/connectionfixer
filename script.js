document.getElementById("processButton").addEventListener("click", function() {
    const inputData = document.getElementById("mapDataInput").value;

    const fixedData = fixConnections(inputData);

    document.getElementById("result").value = fixedData;
});

function fixConnections(data) {
    let normalizedData = data.replace(/\r\n|\r|\n/g, '\n').replace(/\t/g, ' ');

    normalizedData = normalizedData.replace(/(Global\.Connections\s*=\s*Array\()[\s\S]*?(\);)/, (match, start, end) => {
        const connectionsContent = match.slice(start.length, -end.length);
        const fixedConnections = connectionsContent.replace(/Vector\(([^)]+)\)/g, (match, p1) => {
            const values = p1.split(',').map(Number);
            const nonZeroValue = values.find(value => value !== 0) || 0;
            return nonZeroValue;
        });
        return start + fixedConnections + end;
    });

    normalizedData = normalizedData.trim();

    return normalizedData;
}

document.getElementById("copyButton").addEventListener("click", function() {
    const resultText = document.getElementById("result");

    navigator.clipboard.writeText(resultText.value);
});
