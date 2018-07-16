loadOptions()

document.getElementById('save_options').addEventListener('click', saveOptions)

function loadOptions() {
  chrome.storage.local.get('auto_group_tabs', function(properties) {
    document.getElementById('auto_group_tabs').checked = properties['auto_group_tabs']
  })
  chrome.storage.local.get('auto_remove_duplicates', function(properties) {
    document.getElementById('auto_remove_duplicates').checked = properties['auto_remove_duplicates']
  })
}

function saveOptions() {
  auto_group_tabs_flag = document.getElementById('auto_group_tabs').checked
  chrome.storage.local.set({'auto_group_tabs': auto_group_tabs_flag}, function() {
      console.log('auto_group_tabs set to ' + auto_group_tabs_flag)
    })
  auto_remove_duplicates_flag = document.getElementById('auto_remove_duplicates').checked
  chrome.storage.local.set({'auto_remove_duplicates': auto_remove_duplicates_flag}, function() {
      console.log('auto_remove_duplicates set to ' + auto_remove_duplicates_flag)
    })
  alert('Options saved.')
}