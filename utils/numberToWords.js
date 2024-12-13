function numberToWords(num) {
    const units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num < 11) return units[num];
    if (num < 20) return teens[num - 11];

    const tensIndex = Math.floor(num / 10) - 2;
    const remainder = num % 10;

    if (remainder === 0) {
        return tens[tensIndex];
    } else {
        return `${tens[tensIndex]} ${units[remainder]}`;
    }
}

module.exports = numberToWords;
