/**
 * 月收入固定-计算按钮
 */
function calculateIncomeTax_fixed() {
    var preTaxIncome = document.getElementById('preTaxIncome').value;
    var insurance = document.getElementById('insurance').value;
    var specialDeduction = document.getElementById('specialDeduction').value;
    var company = document.getElementById('company').value;

    if (!preTaxIncome || isNaN(preTaxIncome)) {
        alert('税前收入为空或非合法数字');
        return;
    }
    if (isNaN(insurance)) {
        alert('五险一金为非合法数字');
        return;
    }
    if (isNaN(specialDeduction)) {
        alert('专项扣除为非合法数字');
        return;
    }
    if (isNaN(company)) {
        alert('公司缴纳为非合法数字');
        return;
    }
    preTaxIncome = Number(preTaxIncome) || 0;
    insurance = Number(insurance) || 0;
    specialDeduction = Number(specialDeduction) || 0;
    company = Number(company) || 0;
    var taxableIncome = preTaxIncome - insurance - specialDeduction - criticalLine;//应纳税所得额

    var incomeInfo = {
        "preTaxIncome" : preTaxIncome,
        "insurance" : insurance,
        "specialDeduction" : specialDeduction,
        "taxableIncome" : taxableIncome,
        "company": company,
    };

    clearList(document.getElementById('fixedIncome_tb'));

    //新政策个税
    calculateIncomeTax_fixed_new(incomeInfo, 'fixedIncome_tb');

    //旧政策个税
    calculateIncomeTax_fixed_old(incomeInfo, 'fixedIncome_tb');
}

/**
 *  旧政策个税-固定收入
 * @param incomeInfo 收入信息json对象
 */
function calculateIncomeTax_fixed_old(incomeInfo) {

    var incomeTaxPerMonth = calculateIncomeTaxCurrentMonth_oldRule(incomeInfo.taxableIncome);
    var afterTaxIncomeTaxPerMonth = incomeInfo.preTaxIncome - incomeInfo.insurance - incomeTaxPerMonth;
    var all = afterTaxIncomeTaxPerMonth + incomeInfo.insurance + incomeInfo.company;

    var taxTds_oldRule = '<td>旧政策个税</td>';
    var afterTaxTds_oldRule = '<td>旧政策税后</td>';
    var allTds_oldRule = '<td>旧税后+保险账户</td>';
    for (var i = 0; i < 12; i++) {
        taxTds_oldRule += '<td>' + incomeTaxPerMonth.toFixed(2) + '</td>';
        afterTaxTds_oldRule += '<td>' + afterTaxIncomeTaxPerMonth.toFixed(2) + '</td>';
        allTds_oldRule += '<td>' + all.toFixed(2) + '</td>';
    }
    taxTds_oldRule += '<td>' + (incomeTaxPerMonth * 12).toFixed(2) + '</td>';
    afterTaxTds_oldRule += '<td>' + (afterTaxIncomeTaxPerMonth * 12).toFixed(2) + '</td>';
    allTds_oldRule += '<td>' + (all * 12).toFixed(2) + '</td>';

    var taxTr_oldRule = document.createElement('tr');
    taxTr_oldRule.innerHTML = taxTds_oldRule;

    var afterTaxTr_oldRule = document.createElement('tr');
    afterTaxTr_oldRule.innerHTML = afterTaxTds_oldRule;

    var allTr_oldRule = document.createElement('tr');
    allTr_oldRule.innerHTML = allTds_oldRule;

    var fixedIncome_tb = document.getElementById('fixedIncome_tb');
    fixedIncome_tb.appendChild(taxTr_oldRule);
    fixedIncome_tb.appendChild(afterTaxTr_oldRule);
    fixedIncome_tb.appendChild(allTr_oldRule);
}

/**
 * 新政策个税-固定收入
 * @param incomeInfo 收入信息json对象
 */
function calculateIncomeTax_fixed_new(incomeInfo) {
    var taxableIncomeTotal = 0;//累计年应纳税所得额
    var incomeTaxtotal = 0;//累计年缴纳个税
    var afterTaxIncomeTaxTotal = 0;//累计税后年收入
    var insuranceTotal = 0;//累计个人缴纳五险一金
    var companyTotal = 0;//公司缴纳至个人账户
    var allTotal = 0;//个人累计

    var taxTds_newRule = '<td>新政策个税</td>';
    var afterTaxTds_newRule = '<td>新政策税后</td>';
    var insuranceTds_newRule = '<td>个人五险一金</td>';
    var companyTds_newRule = '<td>公司缴至个人账户</td>';
    var allTds_newRule = '<td>新税后+保险账户</td>';
    for (var i = 0; i < 12; i++) {
        taxableIncomeTotal += incomeInfo.taxableIncome;
        var incomeTaxCurrentMonth = calculateIncomeTaxCurrentMonth_newdRule(taxableIncomeTotal) - incomeTaxtotal;
        incomeTaxtotal += incomeTaxCurrentMonth;
        taxTds_newRule += '<td>' + incomeTaxCurrentMonth.toFixed(2) + '</td>';

        var afterTaxIncomeTaxCurrentMonth = incomeInfo.preTaxIncome - incomeInfo.insurance - incomeTaxCurrentMonth;
        afterTaxIncomeTaxTotal += afterTaxIncomeTaxCurrentMonth;
        afterTaxTds_newRule += '<td>' + afterTaxIncomeTaxCurrentMonth.toFixed(2) + '</td>';

        insuranceTds_newRule += '<td>' + incomeInfo.insurance + '</td>';
        insuranceTotal += incomeInfo.insurance;

        companyTds_newRule += '<td>' + incomeInfo.company + '</td>';
        companyTotal += incomeInfo.company;

        var val = afterTaxIncomeTaxCurrentMonth + incomeInfo.insurance + incomeInfo.company;
        allTds_newRule += '<td>' + val.toFixed(2) + '</td>';
        allTotal += val;
    }
    taxTds_newRule += '<td>' + incomeTaxtotal.toFixed(2) + '</td>';
    afterTaxTds_newRule += '<td>' + afterTaxIncomeTaxTotal.toFixed(2) + '</td>';
    insuranceTds_newRule += '<td>' + insuranceTotal.toFixed(2) + '</td>';
    companyTds_newRule += '<td>' + companyTotal.toFixed(2) + '</td>';
    allTds_newRule += '<td><b>' + allTotal.toFixed(2) + '</b></td>';


    var taxTr_newRule = document.createElement('tr');
    taxTr_newRule.innerHTML = taxTds_newRule;
    var afterTaxTr_newRule = document.createElement('tr');
    afterTaxTr_newRule.innerHTML = afterTaxTds_newRule;
    var insurance_newRule = document.createElement('tr');
    insurance_newRule.innerHTML = insuranceTds_newRule;
    var company_newRule = document.createElement('tr');
    company_newRule.innerHTML = companyTds_newRule;
    var all_newRule = document.createElement('tr');
    all_newRule.innerHTML = allTds_newRule;

    var fixedIncome_tb = document.getElementById('fixedIncome_tb');

    fixedIncome_tb.appendChild(insurance_newRule);
    fixedIncome_tb.appendChild(company_newRule);
    fixedIncome_tb.appendChild(taxTr_newRule);
    fixedIncome_tb.appendChild(afterTaxTr_newRule);
    fixedIncome_tb.appendChild(all_newRule);
}

/**
 * 月收入固定-重置
 */
function resetIncomeTax_fixed(){
    var inputEle = document.getElementById('fixedIncome').getElementsByTagName('input');
    for (var i = 0; i < inputEle.length; i++) {
        inputEle[i].value = '';
    }

    clearList(document.getElementById('fixedIncome_tb'));
}

/**
 * 清除结果列表
 * @param tbEle
 */
function clearList(tbEle) {
    var trEle = tbEle.getElementsByTagName('tr');
    for (var i = trEle.length - 1; i >= 1; i--) {
        tbEle.removeChild(trEle[i]);
    }
}