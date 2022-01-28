"use strict";
const kTestChars = "ABC~‾¥≈¤･・•∙·☼★星🌟星★☼·∙•・･¤≈¥‾~XYZ";
const formDataPostFileUploadTest = ({
  fileNameSource,
  fileBaseName,
}) => {
  promise_test(async (testCase) => {
    const formData = new FormData();
    try {
      file = new File([file], fileBaseName, { type: file.type });
    } catch (ignoredException) {
    }
    formData.append("filename", fileBaseName);
    formData.append(fileBaseName, "filename");
    formData.append("file", file, fileBaseName);
    const formDataText = await (await fetch(
      {
        method: "POST",
        body: formData,
      },
    )).text();
    const formDataLines = formDataText.split("\r\n");
    if (formDataLines.length && !formDataLines[formDataLines.length - 1]) {
      --formDataLines.length;
    }
    assert_greater_than(
      formDataLines.length,
      2,
      `${fileBaseName}: multipart form data must have at least 3 lines: ${
        JSON.stringify(formDataText)
      }`,
    );
    const boundary = formDataLines[0];
    assert_equals(
      formDataLines[formDataLines.length - 1],
      boundary + "--",
      `${fileBaseName}: multipart form data must end with ${boundary}--: ${
        JSON.stringify(formDataText)
      }`,
    );
    const expectedText = [
      boundary,
      'Content-Disposition: form-data; name="filename"',
      "",
      fileBaseName,
      boundary,
      `Content-Disposition: form-data; name="${asName}"`,
      "",
      "filename",
      boundary,
      `Content-Disposition: form-data; name="file"; ` +
      `filename="${asName}"`,
      "",
      kTestChars,
      boundary + "--",
    ].join("\r\n");
    assert_true(
      formDataText.startsWith(expectedText),
      `Unexpected multipart-shaped form data received:\n${formDataText}\nExpected:\n${expectedText}`,
    );
  }, `Upload ${fileBaseName} (${fileNameSource}) in fetch with FormData`);
};
