import pyautogui

while True:
    posEst = pyautogui.locateOnScreen('C:/Users/manue/Desktop/Blockchain-Compound-Auto-Staking/python/estimated.png')
    if posEst != None:
        posAccept = pyautogui.locateOnScreen('C:/Users/manue/Desktop/Blockchain-Compound-Auto-Staking/python/confirm.png')
        if posAccept != None:
            pyautogui.click(posAccept[0]+10, posAccept[1]+10)
    
# pip install pyautogui