(function() {
  // Global variables
  const results = [];
  const calculations = [];

  // DOM elements
  const modal = document.getElementById('modal');
  const startCalcBtn = document.getElementById('startCalc');
  const closeBtn = document.querySelector('.close');
  const calculateBtn = document.getElementById('calculateBtn');
  const finishBtn = document.getElementById('finishBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const firstNumberInput = document.getElementById('firstNumber');
  const secondNumberInput = document.getElementById('secondNumber');
  const operatorSelect = document.getElementById('operator');
  const detailedResults = document.getElementById('detailedResults');
  const summaryResults = document.getElementById('summaryResults');

  // Event listeners
  startCalcBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  calculateBtn.addEventListener('click', performCalculation);
  finishBtn.addEventListener('click', finishAndShowResults);
  cancelBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Enter key support for inputs
  firstNumberInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') secondNumberInput.focus();
  });

  secondNumberInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') performCalculation();
  });

  function openModal() {
    modal.style.display = 'block';
    firstNumberInput.focus();
    clearInputs();
  }

  function closeModal() {
    modal.style.display = 'none';
    clearInputs();
  }

  function clearInputs() {
    firstNumberInput.value = '';
    secondNumberInput.value = '';
    operatorSelect.value = '+';
  }

  function performCalculation() {
    const xRaw = firstNumberInput.value.trim();
    const yRaw = secondNumberInput.value.trim();
    const op = operatorSelect.value;

    // Validation
    if (!xRaw || !yRaw) {
      showError('Please enter both numbers');
      return;
    }

    const x = parseFloat(xRaw);
    const y = parseFloat(yRaw);

    if (isNaN(x) || isNaN(y)) {
      showError('Please enter valid numbers');
      return;
    }

    let result;
    let isValid = true;

    // Perform calculation
    switch (op) {
      case '+':
        result = x + y;
        break;
      case '-':
        result = x - y;
        break;
      case '*':
        result = x * y;
        break;
      case '/':
        if (y === 0) {
          result = 'Error: Division by zero';
          isValid = false;
        } else {
          result = x / y;
        }
        break;
      case '%':
        if (y === 0) {
          result = 'Error: Modulus by zero';
          isValid = false;
        } else {
          result = x % y;
        }
        break;
      default:
        result = 'Error: Invalid operator';
        isValid = false;
    }

    // Store valid numeric results
    if (isValid && typeof result === 'number') {
      results.push(result);
    }

    // Store calculation details
    calculations.push({
      x: xRaw,
      y: yRaw,
      op: op,
      result: result
    });

    // Add calculation to detailed results
    addCalculationToDisplay(xRaw, op, yRaw, result);

    // Clear inputs for next calculation
    clearInputs();
    firstNumberInput.focus();
    
    // Show success message
    showSuccess(`Calculation completed: ${xRaw} ${op} ${yRaw} = ${result}`);
  }

  function addCalculationToDisplay(x, op, y, result) {
    const calculationDiv = document.createElement('div');
    calculationDiv.className = 'calculation-row';
    
    const operatorSymbol = getOperatorSymbol(op);
    
    calculationDiv.innerHTML = `
      <span class="number">${x}</span>
      <span class="operator">${operatorSymbol}</span>
      <span class="number">${y}</span>
      <span class="operator">=</span>
      <span class="${typeof result === 'number' ? 'result' : 'error'}">${result}</span>
    `;
    
    detailedResults.appendChild(calculationDiv);
  }

  function getOperatorSymbol(op) {
    const symbols = {
      '+': '+',
      '-': '-',
      '*': '×',
      '/': '÷',
      '%': '%'
    };
    return symbols[op] || op;
  }

  function finishAndShowResults() {
    closeModal();
    displayAllResults();
  }

  function displayAllResults() {
    // Clear previous results
    detailedResults.innerHTML = '';
    summaryResults.innerHTML = '';

    // Remove any existing back to home button
    const existingBackButton = document.querySelector('.back-to-home-section');
    if (existingBackButton) {
      existingBackButton.remove();
    }

    // Display all calculations in tables
    if (calculations.length > 0) {
      // Create detailed results table
      let detailedTableHTML = '<div class="results-section"><h3>All Calculations</h3><table class="detail">';
      detailedTableHTML += '<tr><th>Number 1</th><th>Operator</th><th>Number 2</th><th>Result</th></tr>';
      
      calculations.forEach(calc => {
        detailedTableHTML += `<tr><td>${calc.x}</td><td>${calc.op}</td><td>${calc.y}</td><td>${calc.result}</td></tr>`;
      });
      
      detailedTableHTML += '</table></div>';
      detailedResults.innerHTML = detailedTableHTML;

      // Display individual calculation rows
      calculations.forEach(calc => {
        addCalculationToDisplay(calc.x, calc.op, calc.y, calc.result);
      });
    }

    // Display summary table
    if (results.length > 0) {
      const total = results.reduce((a, b) => a + b, 0);
      const min = Math.min(...results);
      const max = Math.max(...results);
      const avg = (total / results.length).toFixed(2);

      const summaryHTML = `
        <div class="results-section">
          <h3>Summary Statistics</h3>
          <table class="summary">
            <tr>
              <th>Minimum</th>
              <th>Maximum</th>
              <th>Average</th>
              <th>Total</th>
              <th>Count</th>
            </tr>
            <tr>
              <td>${min}</td>
              <td>${max}</td>
              <td>${avg}</td>
              <td>${total}</td>
              <td>${results.length}</td>
            </tr>
          </table>
        </div>
      `;

      summaryResults.innerHTML = summaryHTML;
    } else {
      summaryResults.innerHTML = '<div class="no-results">No valid calculations were performed.</div>';
    }

    // Add Back to Home button
    const backButtonHTML = `
      <div class="back-to-home-section">
        <a href="index.html" class="btn-primary">Back to Home</a>
      </div>
    `;
    
    // Append the back button after the summary results
    summaryResults.insertAdjacentHTML('afterend', backButtonHTML);
  }

  function initializePage() {
    // Clear any existing content
    detailedResults.innerHTML = '';
    summaryResults.innerHTML = '';
    
    // Remove any existing back to home button
    const existingBackButton = document.querySelector('.back-to-home-section');
    if (existingBackButton) {
      existingBackButton.remove();
    }
  }

  function showError(message) {
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #e74c3c;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
      z-index: 1001;
      animation: slideInRight 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(errorDiv);
      }, 300);
    }, 3000);
  }

  function showSuccess(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
      z-index: 1001;
      animation: slideInRight 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 300);
    }, 3000);
  }

  // Add CSS animations for notifications
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Initialize the page
  initializePage();
})(); 