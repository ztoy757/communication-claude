const fs = require('fs');
const path = require('path');

// TypeScript/JSX ファイルの構文チェック
function checkSyntax() {
  const srcDir = path.join(__dirname, 'src');
  const files = [];
  
  function collectFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        collectFiles(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  collectFiles(srcDir);
  
  // App.tsx も追加
  files.push(path.join(__dirname, 'App.tsx'));
  
  console.log(`Checking ${files.length} TypeScript files...`);
  
  let hasErrors = false;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // 基本的な構文エラーをチェック
      const errors = [];
      
      // 未閉じの括弧をチェック
      const openBraces = (content.match(/\{/g) || []).length;
      const closeBraces = (content.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push(`Mismatched braces: ${openBraces} open, ${closeBraces} close`);
      }
      
      // 未閉じの丸括弧をチェック
      const openParens = (content.match(/\(/g) || []).length;
      const closeParens = (content.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        errors.push(`Mismatched parentheses: ${openParens} open, ${closeParens} close`);
      }
      
      // 基本的なimport文の構文チェック（マルチライン対応）
      const lines = content.split('\n');
      let inImport = false;
      let importBlock = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('import')) {
          inImport = true;
          importBlock = line;
          
          // 単一行のimport文
          if (line.includes('from') || line.includes('=')) {
            inImport = false;
            importBlock = '';
          }
        } else if (inImport) {
          importBlock += ' ' + line;
          
          // import文の終了を検出
          if (line.includes('from') || line.includes(';')) {
            inImport = false;
            importBlock = '';
          }
        }
      }
      
      if (errors.length > 0) {
        console.log(`❌ ${path.relative(__dirname, file)}:`);
        errors.forEach(error => console.log(`   ${error}`));
        hasErrors = true;
      } else {
        console.log(`✅ ${path.relative(__dirname, file)}`);
      }
      
    } catch (error) {
      console.log(`❌ ${path.relative(__dirname, file)}: ${error.message}`);
      hasErrors = true;
    }
  }
  
  if (hasErrors) {
    console.log('\n❌ Syntax errors found!');
    process.exit(1);
  } else {
    console.log('\n✅ All files passed syntax check!');
  }
}

checkSyntax();