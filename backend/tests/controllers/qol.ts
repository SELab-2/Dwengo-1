export function checkReturnList(jsonMock: Mock, listName: string) {
	expect(jsonMock).toHaveBeenCalled();

	const result = jsonMock.mock.lastCall![0];
		
	expect(listName in result).toBeTruthy();
}

export function checkReturn404(jsonMock: Mock, statusMock: Mock) {
		expect(statusMock).toHaveBeenCalledWith(404);
		expect(jsonMock).toHaveBeenCalled();
}
