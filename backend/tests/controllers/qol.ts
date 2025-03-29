export function checkReturnList(jsonMock: Mock, listName: string, length?: number) {
	expect(jsonMock).toHaveBeenCalled();

	const result = jsonMock.mock.lastCall![0];
		
	expect(listName in result).toBeTruthy();

	if (length) {
		expect(result[listName].length).toBe(length);
	}
}

export function checkReturn404(jsonMock: Mock, statusMock: Mock) {
	expect(statusMock).toHaveBeenCalledWith(404);
	expect(jsonMock).toHaveBeenCalled();
}
