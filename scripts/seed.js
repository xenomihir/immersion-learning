const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Reading history-immersion-library-v1.md...");
  const filePath = path.resolve(__dirname, '../history-immersion-library-v1.md');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // --- Parse Forces ---
  console.log("Parsing Forces...");
  const forces = [];
  const taxonomySection = fileContent.split('## Part 2 — The Forces taxonomy')[1].split('## Part 3 — The scenario schema')[0];
  
  let currentCategory = "";
  for (const line of taxonomySection.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      currentCategory = trimmed.replace(/\*\*/g, '');
    } else if (trimmed.startsWith('- ')) {
      const parts = trimmed.substring(2).split(' — ');
      const name = parts[0].trim();
      const description = parts[1] ? parts[1].trim() : "No description provided.";
      const key = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
      forces.push({
        key,
        name,
        category: currentCategory,
        description
      });
    }
  }

  console.log(`Found ${forces.length} forces. Inserting...`);
  // Upsert forces (assuming key is unique)
  const { error: forcesError } = await supabase.from('forces').upsert(forces, { onConflict: 'key' });
  if (forcesError) {
    console.error("Error inserting forces:", forcesError);
  } else {
    console.log("Forces inserted successfully!");
  }

  // --- Parse Scenarios ---
  console.log("Parsing Scenarios...");
  const scenariosSection = fileContent.split('## Part 4 — The scenarios')[1].split('## What\'s next')[0];
  
  const scenarios = [];
  const scenarioBlocks = scenariosSection.split('### ').slice(1); // skip anything before the first ###

  for (const block of scenarioBlocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    
    // First line is Title (ID - Name) e.g., "E1 — Nixon ends Bretton Woods"
    const title = lines[0];
    
    // Extract metadata from backticks
    let metadataStr = "";
    let forcesStr = "";
    for (const line of lines) {
      if (line.startsWith('`mode:') || line.startsWith('`date:')) {
        metadataStr += line.replace(/`/g, '') + " | ";
      }
      if (line.startsWith('`forces:')) {
        forcesStr = line.replace(/`/g, '').replace('forces:', '').trim();
      }
    }

    const modeMatch = metadataStr.match(/mode:\s*([^|]+)/i);
    const dateMatch = metadataStr.match(/date:\s*([^|]+)/i);
    const geoMatch = metadataStr.match(/geo:\s*([^|]+)/i);
    const difficultyMatch = metadataStr.match(/difficulty:\s*([^|]+)/i);
    const obscurityMatch = metadataStr.match(/obscurity:\s*([^|]+)/i);

    const mode = modeMatch ? modeMatch[1].trim() : "Focused";
    const date = dateMatch ? dateMatch[1].trim() : "Unknown";
    const geography = geoMatch ? geoMatch[1].trim() : "Unknown";
    const difficulty = difficultyMatch ? parseInt(difficultyMatch[1].trim()) : 1;
    const obscurity = obscurityMatch ? parseInt(obscurityMatch[1].trim()) : 1;

    const parsedForces = forcesStr.split(',').map(f => f.trim()).filter(f => f);

    // Extract SETUP and ANSWER KEY
    const setupIndex = block.indexOf('**SETUP.**');
    const answerKeyIndex = block.indexOf('**ANSWER KEY.**');
    
    if (setupIndex === -1 || answerKeyIndex === -1) {
      console.warn(`Skipping scenario ${title} due to missing SETUP or ANSWER KEY.`);
      continue;
    }

    const setupText = block.substring(setupIndex + '**SETUP.**'.length, answerKeyIndex).trim();
    const answerKeySection = block.substring(answerKeyIndex + '**ANSWER KEY.**'.length).trim();

    const causalMatch = answerKeySection.match(/-\s+\*Causal chain\.\*\s+(.*?)(?=\n-\s+\*|$)/s);
    // Some are called "Forces at play." instead of "Causal chain." (like marketing ones)
    const forcesAtPlayMatch = answerKeySection.match(/-\s+\*Forces at play\.\*\s+(.*?)(?=\n-\s+\*|$)/s);
    
    const mistakeMatch = answerKeySection.match(/-\s+\*What most people get wrong\.\*\s+(.*?)(?=\n-\s+\*|$)/s);
    const nonobviousMatch = answerKeySection.match(/-\s+\*The non-obvious force\.\*\s+(.*?)(?=\n-\s+\*|$)/s);
    const probMatch = answerKeySection.match(/-\s+\*Probability note\.\*\s+(.*?)(?=\n-\s+\*|$)/s);

    const answer_causal_chain = (causalMatch ? causalMatch[1] : (forcesAtPlayMatch ? forcesAtPlayMatch[1] : "")).trim().replace(/\n/g, ' ');
    const answer_dominant_forces = ""; // Derived from answer_causal_chain or prompt instructions
    const answer_common_mistake = mistakeMatch ? mistakeMatch[1].trim().replace(/\n/g, ' ') : "";
    const answer_nonobvious_force = nonobviousMatch ? nonobviousMatch[1].trim().replace(/\n/g, ' ') : "";
    const answer_probability_note = probMatch ? probMatch[1].trim().replace(/\n/g, ' ') : "";

    const domain_tags = title.startsWith('E') ? ['economics'] : (title.startsWith('M') ? ['marketing'] : []);

    scenarios.push({
      title,
      mode,
      domain_tags,
      forces: parsedForces,
      difficulty,
      obscurity,
      date,
      geography,
      setup: setupText,
      answer_causal_chain,
      answer_dominant_forces: parsedForces.join(', '), // Just store forces string for now
      answer_common_mistake,
      answer_nonobvious_force,
      answer_probability_note,
      status: 'live'
    });
  }

  console.log(`Found ${scenarios.length} scenarios. Inserting...`);
  // Insert scenarios
  // To avoid duplicates, we can clear the table or just insert. For MVP, we'll just delete all scenarios first or ignore.
  // We'll try to delete all existing ones first.
  await supabase.from('scenarios').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
  
  const { error: scenariosError } = await supabase.from('scenarios').insert(scenarios);
  if (scenariosError) {
    console.error("Error inserting scenarios:", scenariosError);
  } else {
    console.log("Scenarios inserted successfully!");
  }

  console.log("Done seeding.");
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
