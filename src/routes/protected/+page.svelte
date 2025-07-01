<script lang="ts">
  import { onMount } from 'svelte';
  import * as XLSX from 'xlsx';
  
  let { data } = $props();
  let pseudo = $state(data.pseudo);
  let showSpreadsheet = $state(false);
  let workbook = $state(null);
  let worksheetData = $state([]);
  let currentSheet = $state('Feuille1');
  let fileInput;
  
  // Données d'exemple
  const defaultData = [
    ['Nom', 'Prénom', 'Age', 'Ville', 'Salaire'],
    ['Dupont', 'Jean', 25, 'Paris', 35000],
    ['Martin', 'Marie', 30, 'Lyon', 42000],
    ['Durand', 'Pierre', 28, 'Marseille', 38000],
    ['', '', '', '', '']  // Ligne vide pour permettre l'édition
  ];
  
  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  }
  
  function initializeSpreadsheet() {
    // Créer un nouveau classeur avec des données par défaut
    const ws = XLSX.utils.aoa_to_sheet(defaultData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, currentSheet);
    
    workbook = wb;
    worksheetData = defaultData;
    showSpreadsheet = true;
  }
  
  function addRow() {
    const newRow = new Array(worksheetData[0]?.length || 5).fill('');
    worksheetData = [...worksheetData, newRow];
    updateWorkbook();
  }
  
  function addColumn() {
    worksheetData = worksheetData.map(row => [...row, '']);
    updateWorkbook();
  }
  
  function updateCell(rowIndex, colIndex, value) {
    worksheetData[rowIndex][colIndex] = value;
    updateWorkbook();
  }
  
  function updateWorkbook() {
    if (workbook) {
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      workbook.Sheets[currentSheet] = ws;
    }
  }
  
  function downloadExcel() {
    if (workbook) {
      XLSX.writeFile(workbook, `${pseudo}_feuille_calcul.xlsx`);
    }
  }
  
  function downloadCSV() {
    if (workbook) {
      const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[currentSheet]);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${pseudo}_feuille_calcul.csv`;
      link.click();
    }
  }
  
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        workbook = wb;
        
        // Charger la première feuille
        const firstSheetName = wb.SheetNames[0];
        currentSheet = firstSheetName;
        const ws = wb.Sheets[firstSheetName];
        worksheetData = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
        
        showSpreadsheet = true;
      };
      reader.readAsArrayBuffer(file);
    }
  }
  
  function calculateSum(colIndex) {
    let sum = 0;
    for (let i = 1; i < worksheetData.length; i++) {
      const value = parseFloat(worksheetData[i][colIndex]);
      if (!isNaN(value)) {
        sum += value;
      }
    }
    return sum;
  }
  
  function calculateAverage(colIndex) {
    let sum = 0;
    let count = 0;
    for (let i = 1; i < worksheetData.length; i++) {
      const value = parseFloat(worksheetData[i][colIndex]);
      if (!isNaN(value)) {
        sum += value;
        count++;
      }
    }
    return count > 0 ? sum / count : 0;
  }
  
  onMount(() => {
    console.log('Composant monté avec SheetJS');
  });
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: #fff;
  padding: 2rem;
  
  .box {
    background: #fff;
    color: #000;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    text-align: center;
    
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      background: #2575fc;
      color: #fff;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s ease;
      
      &:hover {
        background: #6a11cb;
      }
      
      &.excel-btn {
        background: #28a745;
        
        &:hover {
          background: #218838;
        }
      }
      
      &.upload-btn {
        background: #17a2b8;
        
        &:hover {
          background: #138496;
        }
      }
    }
    
    .file-input {
      margin: 1rem 0;
      
      input[type="file"] {
        padding: 0.5rem;
        border: 2px dashed #2575fc;
        border-radius: 0.5rem;
        background: #f8f9fa;
      }
    }
  }
}

.spreadsheet-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  
  .spreadsheet-header {
    background: #2575fc;
    color: #fff;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    
    h2 {
      margin: 0;
      font-size: 1.5rem;
    }
    
    .header-actions {
      display: flex;
      gap: 0.5rem;
      
      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        background: #fff;
        color: #2575fc;
        cursor: pointer;
        font-weight: bold;
        font-size: 0.9rem;
        
        &:hover {
          background: #f8f9fa;
        }
        
        &.close-btn {
          background: #dc3545;
          color: #fff;
          
          &:hover {
            background: #c82333;
          }
        }
      }
    }
  }
  
  .toolbar {
    background: #f8f9fa;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-shrink: 0;
    
    button {
      padding: 0.25rem 0.5rem;
      border: 1px solid #dee2e6;
      border-radius: 0.25rem;
      background: #fff;
      cursor: pointer;
      font-size: 0.8rem;
      
      &:hover {
        background: #e9ecef;
      }
    }
    
    .stats {
      margin-left: auto;
      font-size: 0.8rem;
      color: #6c757d;
    }
  }
  
  .spreadsheet-content {
    flex: 1;
    overflow: auto;
    padding: 1rem;
    
    .table-container {
      overflow: auto;
      border: 1px solid #dee2e6;
      border-radius: 0.5rem;
      
      table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        
        th, td {
          border: 1px solid #dee2e6;
          padding: 0.5rem;
          text-align: left;
          min-width: 100px;
          
          input {
            width: 100%;
            border: none;
            padding: 0.25rem;
            font-size: 0.9rem;
            
            &:focus {
              outline: 2px solid #2575fc;
              background: #f0f8ff;
            }
          }
        }
        
        th {
          background: #f8f9fa;
          font-weight: bold;
          color: #495057;
        }
        
        tr:nth-child(even) {
          background: #f9f9f9;
        }
        
        tr:hover {
          background: #e3f2fd;
        }
      }
    }
  }
}
</style>

<div class="container">
  <div class="box">
    <h1>Bienvenue {pseudo} 👋</h1>
    
    <div class="button-group">
      <button class="excel-btn" onclick={initializeSpreadsheet}>
        📊 Nouvelle feuille Excel
      </button>
      <button onclick={logout}>Se déconnecter</button>
    </div>
    
    <div class="file-input">
      <label for="file-upload">📁 Ou importer un fichier Excel/CSV :</label>
      <input 
        id="file-upload"
        type="file" 
        accept=".xlsx,.xls,.csv" 
        onchange={handleFileUpload}
        bind:this={fileInput}
      />
    </div>
  </div>
</div>

{#if showSpreadsheet}
  <div class="spreadsheet-container">
    <div class="spreadsheet-header">
      <h2>📊 {currentSheet} - {pseudo}</h2>
      <div class="header-actions">
        <button onclick={downloadExcel}>💾 Télécharger Excel</button>
        <button onclick={downloadCSV}>📄 Télécharger CSV</button>
        <button class="close-btn" onclick={() => showSpreadsheet = false}>✕ Fermer</button>
      </div>
    </div>
    
    <div class="toolbar">
      <button onclick={addRow}>➕ Ligne</button>
      <button onclick={addColumn}>➕ Colonne</button>
      <div class="stats">
        Lignes: {worksheetData.length} | 
        Colonnes: {worksheetData[0]?.length || 0}
        {#if worksheetData.length > 1 && worksheetData[0]?.length > 4}
          | Somme col 5: {calculateSum(4).toLocaleString('fr-FR')} | 
          Moyenne col 5: {calculateAverage(4).toFixed(2)}
        {/if}
      </div>
    </div>
    
    <div class="spreadsheet-content">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              {#each Array(Math.max(5, worksheetData[0]?.length || 0)) as _, colIndex}
                <th>{String.fromCharCode(65 + colIndex)}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each worksheetData as row, rowIndex}
              <tr>
                {#each Array(Math.max(5, worksheetData[0]?.length || 0)) as _, colIndex}
                  <td>
                    <input 
                      type="text" 
                      value={row[colIndex] || ''} 
                      oninput={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      placeholder={rowIndex === 0 ? 'En-tête' : 'Valeur'}
                    />
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
{/if}